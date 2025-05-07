
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type DoctorConnection = {
  id: string;
  doctor: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function ConnectedDoctors() {
  const [connections, setConnections] = useState<DoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectedDoctors();
  }, []);

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
      // Protected by the RLS policy "Patients can view invitations they sent"
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
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

      setConnections(data as unknown as DoctorConnection[]);
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

  const getDoctorInitials = (doctor: DoctorConnection['doctor']) => {
    const first = doctor.first_name?.[0] || '';
    const last = doctor.last_name?.[0] || '';
    return (first + last).toUpperCase() || doctor.email[0].toUpperCase();
  };

  const getDoctorName = (doctor: DoctorConnection['doctor']) => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return `Dr. ${doctor.first_name}`;
    } else {
      return doctor.email;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Connected Doctors</CardTitle>
        <CardDescription>
          Doctors who can access your ECG data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading connections...</div>
        ) : connections.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You have no connected doctors
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <Avatar className="h-10 w-10 bg-primary">
                  <AvatarFallback>{getDoctorInitials(connection.doctor)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getDoctorName(connection.doctor)}</p>
                  <p className="text-xs text-muted-foreground">{connection.doctor.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
