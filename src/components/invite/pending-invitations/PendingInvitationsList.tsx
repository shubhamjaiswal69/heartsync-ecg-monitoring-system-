
import { usePendingInvitations } from "./usePendingInvitations";
import { InvitationCard } from "./InvitationCard";

export function PendingInvitationsList() {
  const { invitations, loading, cancelling, cancelInvitation } = usePendingInvitations();

  if (loading) {
    return <div className="text-center py-4">Loading invitations...</div>;
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        You have no pending invitations
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          isCancelling={cancelling === invitation.id}
          onCancel={() => cancelInvitation(invitation.id)}
        />
      ))}
    </div>
  );
}
