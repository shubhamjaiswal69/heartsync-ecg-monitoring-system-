
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCog } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type Doctor = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url?: string | null;
};

interface DoctorSelectorProps {
  selectedDoctor: string;
  onDoctorChange: (doctorId: string) => void;
}

export function DoctorSelector({ selectedDoctor, onDoctorChange }: DoctorSelectorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConnectedDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("You must be logged in to view your connected doctors.");
          return;
        }

        // Updated query to exclude avatar_url since it doesn't exist in the profiles table
        const { data, error } = await supabase
          .from('doctor_patient_relationships')
          .select(`
            doctor_id,
            doctor:profiles!doctor_patient_relationships_doctor_id_fkey(
              id,
              first_name,
              last_name,
              email
            )
          `)
          .eq('patient_id', user.id)
          .eq('status', 'accepted');

        if (error) throw error;

        // Extract and transform doctor data from relationships
        const connectedDoctors = data.map(item => ({
          id: item.doctor.id,
          first_name: item.doctor.first_name,
          last_name: item.doctor.last_name,
          email: item.doctor.email,
          avatar_url: null // Set a default value since we don't have this field yet
        }));
        
        setDoctors(connectedDoctors);

        // Set first doctor as default if there's one and none is selected
        if (connectedDoctors.length > 0 && !selectedDoctor) {
          onDoctorChange(connectedDoctors[0].id);
          toast({
            title: "Doctor Selected",
            description: `ECG data will be shared with ${getDoctorName(connectedDoctors[0])}.`,
          });
        } else if (connectedDoctors.length === 0 && selectedDoctor) {
          // If current selected doctor is no longer available, clear selection
          onDoctorChange('');
        } else if (selectedDoctor && !connectedDoctors.some(d => d.id === selectedDoctor)) {
          // If the selected doctor is no longer in the list (e.g., removed)
          onDoctorChange('');
          toast({
            title: "Doctor connection removed",
            description: "The selected doctor is no longer connected to your account.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching connected doctors:", error);
        setError("Failed to load your connected doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedDoctors();

    // Set up realtime subscription to reflect removed connections
    const channel = supabase
      .channel('doctor-patient-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'doctor_patient_relationships'
        }, 
        (payload) => {
          console.log('Doctor relationship change:', payload);
          // Refresh doctor list when relationship changes
          fetchConnectedDoctors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const handleDoctorChange = (doctorId: string) => {
    onDoctorChange(doctorId);
    
    if (doctorId) {
      const selectedDoc = doctors.find(d => d.id === doctorId);
      if (selectedDoc) {
        toast({
          title: "Doctor Selected",
          description: `ECG data will be shared with ${getDoctorName(selectedDoc)}.`,
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="doctor-select">Share with Doctor</Label>
      
      {error ? (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      
      {loading ? (
        <div className="flex items-center gap-2 h-10 px-3 rounded-md border">
          <Spinner className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Loading doctors...</span>
        </div>
      ) : (
        <>
          {doctors.length === 0 ? (
            <div className="flex items-center gap-2 h-10 px-3 py-2 rounded-md border bg-muted">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">No connected doctors</span>
            </div>
          ) : (
            <Select
              value={selectedDoctor}
              onValueChange={handleDoctorChange}
            >
              <SelectTrigger id="doctor-select">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {getDoctorName(doctor)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </>
      )}
    </div>
  );
}
