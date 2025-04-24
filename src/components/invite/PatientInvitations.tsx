
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PatientInvite = {
  id: string;
  patient_id: string;
  status: string;
  created_at: string;
  patient: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function PatientInvitations() {
  const [invitations, setInvitations] = useState<PatientInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
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
          patient_id,
          status,
          created_at,
          patient:patient_id(first_name, last_name, email)
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      setInvitations(data as unknown as PatientInvite[]);
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

  const handleResponse = async (invitationId: string, accept: boolean) => {
    try {
      setResponding(invitationId);
      
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', invitationId);

      if (error) throw error;

      // Update local state
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      
      toast({
        title: accept ? "Invitation accepted" : "Invitation rejected",
        description: accept 
          ? "You are now connected with this patient." 
          : "You have rejected this invitation.",
      });
    } catch (error) {
      console.error("Error responding to invitation:", error);
      toast({
        title: "Error",
        description: "Failed to respond to invitation.",
        variant: "destructive",
      });
    } finally {
      setResponding(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Invitations</CardTitle>
        <CardDescription>
          Patients requesting to connect with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No pending invitations</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">
                    {invite.patient.first_name} {invite.patient.last_name}
                    <div className="text-xs text-muted-foreground">{invite.patient.email}</div>
                  </TableCell>
                  <TableCell>
                    {new Date(invite.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResponse(invite.id, true)}
                        disabled={responding === invite.id}
                        className="flex gap-1 items-center"
                      >
                        <ThumbsUp size={16} />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResponse(invite.id, false)}
                        disabled={responding === invite.id}
                        className="flex gap-1 items-center"
                      >
                        <ThumbsDown size={16} />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
