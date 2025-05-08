
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DoctorInviteForm } from "@/components/invite/DoctorInviteForm";
import { ConnectedDoctors } from "@/components/invite/ConnectedDoctors";
import { PendingInvitations } from "@/components/invite/PendingInvitations";
import { PreviousConnectedDoctors } from "@/components/invite/PreviousConnectedDoctors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PatientInviteDoctor = () => {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Connect with Doctors</h1>
        <p className="text-muted-foreground">
          Connect with healthcare professionals to share your ECG data and get remote consultations.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <DoctorInviteForm />
          
          <div className="space-y-6">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="previous">Previous</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-6 pt-4">
                <ConnectedDoctors />
                <PendingInvitations />
              </TabsContent>
              <TabsContent value="previous" className="space-y-6 pt-4">
                <PreviousConnectedDoctors />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientInviteDoctor;
