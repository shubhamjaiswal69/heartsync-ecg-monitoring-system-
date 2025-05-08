
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type DoctorInvitation = {
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
  const [invitations, setInvitations] = useState<DoctorInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDoctorInitials = (doctor: DoctorInvitation['doctor']) => {
    const first = doctor.first_name?.[0] || '';
    const last = doctor.last_name?.[0] || '';
    return (first + last).toUpperCase() || doctor.email[0].toUpperCase();
  };

  const getDoctorName = (doctor: DoctorInvitation['doctor']) => {
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
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Doctors you've invited who haven't accepted yet
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
              <div key={invitation.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary">
                    <AvatarFallback>{getDoctorInitials(invitation.doctor)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{getDoctorName(invitation.doctor)}</p>
                    <p className="text-xs text-muted-foreground">Invited on {formatDate(invitation.created_at)}</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => cancelInvitation(invitation.id)}
                  disabled={cancelling === invitation.id}
                >
                  <ExternalLink size={14} className="mr-2" />
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
