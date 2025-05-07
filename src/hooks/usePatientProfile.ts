
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PatientProfile {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  blood_type: string | null;
  height: number | null;
  weight: number | null;
  medical_history: string | null;
  allergies: string | null;
  current_medications: string | null;
  emergency_contact: string | null;
  email?: string;
}

export function usePatientProfile(patientId: string | undefined) {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    async function fetchPatientProfile() {
      try {
        setLoading(true);
        setError(null);

        // First get basic profile info (email, etc)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("email, first_name, last_name")
          .eq("id", patientId)
          .single();

        if (profileError) throw profileError;

        // Then get detailed patient profile
        const { data: patientProfileData, error: patientProfileError } = await supabase
          .from("patient_profiles")
          .select("*")
          .eq("id", patientId)
          .single();

        if (patientProfileError && patientProfileError.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is OK (might be a new user)
          throw patientProfileError;
        }

        // Combine the data
        setProfile({
          ...patientProfileData,
          id: patientId,
          email: profileData?.email,
          full_name: patientProfileData?.full_name || 
            (profileData?.first_name && profileData?.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : profileData?.first_name || "Unknown Patient")
        });
      } catch (err: any) {
        console.error("Error fetching patient profile:", err);
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load patient profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchPatientProfile();
  }, [patientId, toast]);

  return { profile, loading, error };
}
