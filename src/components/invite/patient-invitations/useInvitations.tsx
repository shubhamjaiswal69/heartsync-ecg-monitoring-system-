
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type Invitation } from "./InvitationsList";

export function useInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view invitations.",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching invitations for doctor:", user.id);

      // Get all pending invitations where the current user is the doctor
      // The RLS policy "Doctors can view invitations to them" will ensure only relevant data is returned
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id, 
          created_at, 
          status,
          patient:patient_id(
            id, 
            first_name, 
            last_name,
            email
          )
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching invitations:", error);
        throw error;
      }

      console.log("Fetched invitations:", data);
      
      // Ensure each invitation has a patient, even if null
      const processedData = data.map((item: any) => ({
        ...item,
        patient: item.patient || null
      }));
      
      setInvitations(processedData as Invitation[]);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load patient invitations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId: string, patientName: string) => {
    try {
      console.log("Accepting invitation:", invitationId);
      
      // This is protected by the RLS policy "Doctors can update connection status"
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (error) {
        console.error("Error accepting invitation:", error);
        throw error;
      }

      // Update the local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Invitation Accepted",
        description: `You are now connected with ${patientName}.`,
      });
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to accept invitation.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (invitationId: string, patientName: string) => {
    try {
      console.log("Rejecting invitation:", invitationId);
      
      // This is protected by the RLS policy "Doctors can update connection status"
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'rejected' })
        .eq('id', invitationId);

      if (error) {
        console.error("Error rejecting invitation:", error);
        throw error;
      }

      // Update the local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Invitation Rejected",
        description: `You have rejected the connection request from ${patientName}.`,
      });
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      toast({
        title: "Error",
        description: "Failed to reject invitation.",
        variant: "destructive",
      });
    }
  };

  return {
    invitations,
    loading,
    fetchInvitations,
    handleAccept,
    handleReject
  };
}
