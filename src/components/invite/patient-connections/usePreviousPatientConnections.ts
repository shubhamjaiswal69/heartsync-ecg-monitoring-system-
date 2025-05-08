
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type PatientConnection = {
  id: string;
  patient: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  status: string;
  removed_at?: string | null;
};

export function usePreviousPatientConnections() {
  const [previousConnections, setPreviousConnections] = useState<PatientConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPreviousPatients = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view your previously connected patients.",
          variant: "destructive",
        });
        return;
      }

      // Get all removed connections where the current user is the doctor
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          status,
          removed_at,
          patient:patient_id(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'removed');

      if (error) throw error;

      setPreviousConnections(data as unknown as PatientConnection[]);
    } catch (error) {
      console.error("Error fetching previously connected patients:", error);
      toast({
        title: "Error",
        description: "Failed to load your previously connected patients.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousPatients();
  }, []);

  return {
    previousConnections,
    loading,
    refreshConnections: fetchPreviousPatients
  };
}
