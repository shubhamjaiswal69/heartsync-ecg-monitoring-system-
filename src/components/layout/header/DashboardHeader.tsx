import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { ProfileDropdown } from "../ProfileDropdown";
import { MobileNavigation } from "../navigation/MobileNavigation";
interface DashboardHeaderProps {
  userType: "patient" | "doctor";
  onLogout: () => void;
  loading?: boolean;
}
export const DashboardHeader = ({
  userType,
  onLogout,
  loading
}: DashboardHeaderProps) => {
  return <header className="bg-card border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MobileNavigation userType={userType} onLogout={onLogout} loading={loading} />
        <h1 className="text-xl font-semibold">
          {userType === "patient" ? "Patient Portal" : "Doctor Portal"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ProfileDropdown />
        <div className="md:hidden">
          
        </div>
      </div>
    </header>;
};