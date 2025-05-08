
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type DoctorConnection = {
  id: string;
  doctor: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  status: string;
};

export function useDoctorConnections() {
  const [connections, setConnections] = useState<DoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingConnection, setRemovingConnection] = useState<string | null>(null);
  const { toast } = useToast();

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
      // and filter out any with "removed" status
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          status,
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

  const removeDoctor = async (connectionId: string) => {
    try {
      setRemovingConnection(connectionId);
      
      // Update the status to 'removed' instead of deleting
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'removed' })
        .eq('id', connectionId);
      
      if (error) throw error;
      
      // Remove from the local state
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
      return true;
    } catch (error) {
      console.error("Error removing doctor connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove doctor connection. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setRemovingConnection(null);
    }
  };

  useEffect(() => {
    fetchConnectedDoctors();
  }, []);

  return {
    connections,
    loading,
    removingConnection,
    removeDoctor
  };
}
