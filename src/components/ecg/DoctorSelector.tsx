
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Doctor = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

interface DoctorSelectorProps {
  selectedDoctor: string;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelector({ selectedDoctor, onDoctorChange }: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConnectedDoctors = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "You must be logged in to view your connected doctors.",
            variant: "destructive",
          });
          return;
        }

        // Get all accepted connections where the current user is the patient
        const { data, error } = await supabase
          .from('doctor_patient_relationships')
          .select(`
            doctor:doctor_id(
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('patient_id', user.id)
          .eq('status', 'accepted');

        if (error) throw error;

        // Extract doctor data from relationships
        const connectedDoctors = data.map(item => item.doctor) as Doctor[];
        setDoctors(connectedDoctors);

        // Set first doctor as default if there's one and none is selected
        if (connectedDoctors.length > 0 && !selectedDoctor) {
          onDoctorChange(connectedDoctors[0].id);
        }
      } catch (error) {
        console.error("Error fetching connected doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load your connected doctors.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedDoctors();
  }, [selectedDoctor, onDoctorChange, toast]);

  const getDoctorName = (doctor: Doctor) => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return `Dr. ${doctor.first_name}`;
    } else {
      return doctor.email;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="doctor-select">Share with Doctor</Label>
      <Select
        value={selectedDoctor}
        onValueChange={onDoctorChange}
        disabled={loading || doctors.length === 0}
      >
        <SelectTrigger id="doctor-select">
          <SelectValue placeholder={
            loading ? "Loading doctors..." : 
            doctors.length === 0 ? "No connected doctors" : 
            "Select a doctor"
          } />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              {getDoctorName(doctor)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
