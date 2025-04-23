
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsOverview } from "@/components/doctor/dashboard/StatsOverview";
import { PatientActivityChart } from "@/components/doctor/dashboard/PatientActivityChart";
import { AlertsList } from "@/components/doctor/dashboard/AlertsList";
import { RecentActivity } from "@/components/doctor/dashboard/RecentActivity";

const DoctorDashboard = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. Smith</h1>
        <p className="text-muted-foreground">
          Monitor your patients' heart health and manage ECG data
        </p>

        <StatsOverview />

        <div className="grid gap-6 md:grid-cols-2">
          <PatientActivityChart />
          <AlertsList />
        </div>

        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
