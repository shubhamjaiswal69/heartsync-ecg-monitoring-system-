
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DoctorInviteForm } from "@/components/invite/DoctorInviteForm";
import { ConnectedDoctors } from "@/components/invite/ConnectedDoctors";
import { PendingInvitations } from "@/components/invite/PendingInvitations";

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
            <ConnectedDoctors />
            <PendingInvitations />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientInviteDoctor;
