
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

type PendingInvite = {
  id: string;
  doctor_id: string;
  status: string;
  created_at: string;
  doctor: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get all pending invitations
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          doctor_id,
          status,
          created_at,
          doctor:doctor_id(first_name, last_name, email)
        `)
        .eq('patient_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      setInvitations(data as unknown as PendingInvite[]);
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

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      setCancelling(invitationId);
      
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      // Update local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: "Invitation cancelled",
        description: "Your invitation has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the invitation.",
        variant: "destructive",
      });
    } finally {
      setCancelling(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Doctor invitations waiting for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No pending invitations</div>
        ) : (
          <div className="space-y-4">
            {invitations.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Dr. {invite.doctor.first_name} {invite.doctor.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{invite.doctor.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent on {new Date(invite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancelInvitation(invite.id)}
                  disabled={cancelling === invite.id}
                  className="flex items-center gap-1"
                >
                  <X size={16} />
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
