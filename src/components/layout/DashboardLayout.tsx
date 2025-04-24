
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DashboardNavLinks } from "./navigation/DashboardNavLinks";
import { DashboardHeader } from "./header/DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "patient" | "doctor";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const { signOut, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="hidden md:block w-64 bg-card border-r md:min-h-screen">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">❤️ HeartSync</span>
          </Link>
        </div>
        <DashboardNavLinks userType={userType} />
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 mt-6"
          onClick={signOut}
          disabled={loading}
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader 
          userType={userType}
          onLogout={signOut}
          loading={loading}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
