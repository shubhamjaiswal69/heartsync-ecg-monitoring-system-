
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReferralCodeGenerator } from "@/components/invite/ReferralCodeGenerator";
import { PatientInvitations } from "@/components/invite/PatientInvitations";

const DoctorManageInvitations = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Patient Connections</h1>
        <p className="text-muted-foreground">
          Generate referral codes to share with patients and manage incoming connection requests.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <ReferralCodeGenerator />
          
          <PatientInvitations />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorManageInvitations;
