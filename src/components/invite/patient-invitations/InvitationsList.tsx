
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { InvitationRow } from "./InvitationRow";

type Patient = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

export type Invitation = {
  id: string;
  created_at: string;
  patient: Patient | null;
  status: string;
};

type InvitationsListProps = {
  invitations: Invitation[];
  onAccept: (invitationId: string, patientName: string) => void;
  onReject: (invitationId: string, patientName: string) => void;
};

export function InvitationsList({ invitations, onAccept, onReject }: InvitationsListProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        You have no pending connection requests
      </div>
    );
  }

  return (
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
          <InvitationRow
            key={invitation.id}
            id={invitation.id}
            patient={invitation.patient}
            createdAt={invitation.created_at}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </TableBody>
    </Table>
  );
}
