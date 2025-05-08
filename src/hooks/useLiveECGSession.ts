
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LiveECGSession {
  id: string;
  patient_id: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  current_heart_rate: number | null;
  device_id: string | null;
  session_notes: string | null;
}

export function useLiveECGSession(patientId: string | undefined) {
  const [session, setSession] = useState<LiveECGSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    async function fetchActiveSessions() {
      try {
        setLoading(true);
        setError(null);

        // This query is protected by RLS policies
        // Only returns data if the doctor has access to the patient
        const { data, error: fetchError } = await supabase
          .from("ecg_live_sessions")
          .select("*")
          .eq("patient_id", patientId)
          .eq("status", "active")
          .order("started_at", { ascending: false })
          .limit(1);

        if (fetchError) {
          console.error("Error fetching active ECG sessions:", fetchError);
          throw fetchError;
        }

        if (data && data.length > 0) {
          setSession(data[0] as LiveECGSession);
        } else {
          setSession(null);
        }
      } catch (err: any) {
        console.error("Error fetching active ECG sessions:", err);
        setError(err.message);
        // Don't show toast for this error as it's not critical
      } finally {
        setLoading(false);
      }
    }

    fetchActiveSessions();

    // Set up real-time subscription for live updates
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'ecg_live_sessions',
          filter: `patient_id=eq.${patientId}`
        }, 
        (payload) => {
          console.log('Live session change:', payload);
          
          // Handle different events
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newSession = payload.new as LiveECGSession;
            
            if (newSession.status === 'active') {
              setSession(newSession);
            } else if (session?.id === newSession.id && newSession.status !== 'active') {
              // If our current session was ended
              setSession(null);
            }
          } else if (payload.eventType === 'DELETE' && session?.id === payload.old.id) {
            setSession(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId, session?.id]);

  return { session, loading, error };
}
