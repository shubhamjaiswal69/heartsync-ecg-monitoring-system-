
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type DoctorInvitation = {
  id: string;
  created_at: string;
  doctor: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function usePendingInvitations() {
  const [invitations, setInvitations] = useState<DoctorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingInvitations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view your pending invitations.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          created_at,
          doctor:doctor_id(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('patient_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      
      setInvitations(data as unknown as DoctorInvitation[]);
    } catch (error) {
      console.error("Error fetching pending invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load your pending invitations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      setCancelling(invitationId);
      
      // Update status to 'cancelled' instead of deleting
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);
      
      if (error) throw error;
      
      setInvitations(prev => prev.filter(invitation => invitation.id !== invitationId));
      
      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  return {
    invitations,
    loading,
    cancelling,
    cancelInvitation,
    fetchPendingInvitations
  };
}
