
import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Activity, 
  UserPlus, 
  History, 
  FileText, 
  Users, 
  LogOut 
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "patient" | "doctor";
}

const DashboardLayout = ({ children, userType }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // In a real app with Supabase, this would sign out the user
    navigate("/");
  };

  const patientLinks = [
    { 
      name: "Dashboard", 
      path: "/patient/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "ECG Viewer", 
      path: "/patient/ecg-viewer", 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: "Invite Doctor", 
      path: "/patient/invite-doctor", 
      icon: <UserPlus className="h-5 w-5" /> 
    },
    { 
      name: "History", 
      path: "/patient/history", 
      icon: <History className="h-5 w-5" /> 
    },
    { 
      name: "Reports", 
      path: "/patient/reports", 
      icon: <FileText className="h-5 w-5" /> 
    }
  ];

  const doctorLinks = [
    { 
      name: "Dashboard", 
      path: "/doctor/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: "Patients", 
      path: "/doctor/patients", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "ECG Viewer", 
      path: "/doctor/ecg-viewer", 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: "Reports", 
      path: "/doctor/reports", 
      icon: <FileText className="h-5 w-5" /> 
    }
  ];

  const links = userType === "patient" ? patientLinks : doctorLinks;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-card border-r border-b md:border-b-0 md:min-h-screen">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">❤️ HeartSync</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                ${isActive(link.path) 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted text-foreground"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 mt-6"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-card border-b p-4">
          <h1 className="text-xl font-semibold">
            {userType === "patient" ? "Patient Portal" : "Doctor Portal"}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
