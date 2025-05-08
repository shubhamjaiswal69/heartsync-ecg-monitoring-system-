
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReferralCodeGenerator } from "@/components/invite/ReferralCodeGenerator";
import { PatientInvitations } from "@/components/invite/PatientInvitations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const DoctorManageInvitations = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Patient Connections</h1>
        <p className="text-muted-foreground">
          Generate referral codes to share with patients and manage incoming connection requests.
        </p>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Connection Management</AlertTitle>
          <AlertDescription>
            When a patient removes a connection, you'll need to send a new invitation request 
            if you wish to reconnect. Any pending invitations will remain visible to patients 
            unless they explicitly accept or reject them. You will no longer see patients' data 
            after they remove the connection.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <ReferralCodeGenerator />
          
          <PatientInvitations />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorManageInvitations;
