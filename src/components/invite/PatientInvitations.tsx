
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Check, X } from "lucide-react";

type Invitation = {
  id: string;
  created_at: string;
  patient: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
  status: string;
};

export function PatientInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

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

      // Get all pending invitations where the current user is the doctor
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

      if (error) throw error;

      setInvitations(data as unknown as Invitation[]);
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

  const handleAccept = async (invitationId: string, patientName: string) => {
    try {
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (error) throw error;

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
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .update({ status: 'rejected' })
        .eq('id', invitationId);

      if (error) throw error;

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

  const getPatientName = (patient: Invitation['patient']) => {
    if (patient.first_name && patient.last_name) {
      return `${patient.first_name} ${patient.last_name}`;
    } else if (patient.first_name) {
      return patient.first_name;
    } else {
      return patient.email;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Connection Requests</CardTitle>
        <CardDescription>
          Review and manage patient requests to connect with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You have no pending connection requests
          </div>
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
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {getPatientName(invitation.patient)}
                  </TableCell>
                  <TableCell>
                    {new Date(invitation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleAccept(invitation.id, getPatientName(invitation.patient))}
                    >
                      <Check size={16} className="text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReject(invitation.id, getPatientName(invitation.patient))}
                    >
                      <X size={16} className="text-red-500" />
                    </Button>
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
