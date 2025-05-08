
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PreviousPatientConnections } from "@/components/invite/PreviousPatientConnections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const DoctorPreviousConnections = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Previous Patient Connections</h1>
        <p className="text-muted-foreground">
          View patients who have removed their connection with you
        </p>

        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle>Removed Connections</AlertTitle>
          <AlertDescription>
            When a patient removes their connection with you, all access to their medical data is immediately revoked.
            To reconnect with a patient, you must generate a new referral code and have the patient enter it.
          </AlertDescription>
        </Alert>

        <PreviousPatientConnections />
      </div>
    </DashboardLayout>
  );
};

export default DoctorPreviousConnections;
