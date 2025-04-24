
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type PendingInvitation = {
  id: string;
  created_at: string;
  doctor: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

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

      // Get all pending invitations where the current user is the patient
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

      setInvitations(data as unknown as PendingInvitation[]);
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

  const handleCancel = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      // Update the local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Invitation Cancelled",
        description: "Your invitation has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation.",
        variant: "destructive",
      });
    }
  };

  const getDoctorName = (doctor: PendingInvitation['doctor']) => {
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
        <CardTitle>Pending Doctor Invitations</CardTitle>
        <CardDescription>
          Invitations you've sent that are waiting for acceptance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You have no pending invitations
          </div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">{getDoctorName(invitation.doctor)}</p>
                  <p className="text-xs text-muted-foreground">
                    Invited on {new Date(invitation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handleCancel(invitation.id)}
                >
                  <X size={16} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
