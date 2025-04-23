
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import RightSideMenu from "./RightSideMenu";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "patient" | "doctor";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app with Supabase, this would sign out the user
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <RightSideMenu userType={userType} onLogout={handleLogout} />
      
      {/* Main Content */}
      <div className="flex-1 min-h-screen p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
