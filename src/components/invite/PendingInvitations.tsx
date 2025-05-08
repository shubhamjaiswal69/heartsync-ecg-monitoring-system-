
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PendingInvitationsList } from "./pending-invitations/PendingInvitationsList";

export function PendingInvitations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Doctors you've invited who haven't accepted yet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PendingInvitationsList />
      </CardContent>
    </Card>
  );
}
