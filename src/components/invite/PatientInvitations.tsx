
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { InvitationsList } from "./patient-invitations/InvitationsList";
import { useInvitations } from "./patient-invitations/useInvitations";

export function PatientInvitations() {
  const { invitations, loading, fetchInvitations, handleAccept, handleReject } = useInvitations();

  const handleRefresh = () => {
    fetchInvitations();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Connection Requests</CardTitle>
          <CardDescription>
            Review and manage patient requests to connect with you
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading invitations...</div>
        ) : (
          <InvitationsList 
            invitations={invitations} 
            onAccept={handleAccept} 
            onReject={handleReject} 
          />
        )}
      </CardContent>
    </Card>
  );
}
