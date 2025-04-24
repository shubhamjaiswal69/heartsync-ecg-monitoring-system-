
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Activity, 
  UserPlus, 
  History, 
  FileText, 
  Users
} from "lucide-react";

interface NavLink {
  name: string;
  path: string;
  icon: React.ComponentType<{ className: string }>;
}

const patientLinks: NavLink[] = [
  { 
    name: "Dashboard", 
    path: "/patient/dashboard", 
    icon: LayoutDashboard
  },
  { 
    name: "ECG Viewer", 
    path: "/patient/ecg-viewer", 
    icon: Activity
  },
  { 
    name: "Invite Doctor", 
    path: "/patient/invite-doctor", 
    icon: UserPlus
  },
  { 
    name: "History", 
    path: "/patient/history", 
    icon: History
  },
  { 
    name: "Reports", 
    path: "/patient/reports", 
    icon: FileText
  }
];

const doctorLinks: NavLink[] = [
  { 
    name: "Dashboard", 
    path: "/doctor/dashboard", 
    icon: LayoutDashboard
  },
  { 
    name: "Patients", 
    path: "/doctor/patients", 
    icon: Users
  },
  { 
    name: "ECG Viewer", 
    path: "/doctor/ecg-viewer", 
    icon: Activity
  },
  { 
    name: "Manage Invitations", 
    path: "/doctor/manage-invitations", 
    icon: UserPlus
  },
  { 
    name: "Reports", 
    path: "/doctor/reports", 
    icon: FileText
  }
];

interface DashboardNavLinksProps {
  userType: "patient" | "doctor";
  onLinkClick?: () => void;
}

export const DashboardNavLinks = ({ userType, onLinkClick }: DashboardNavLinksProps) => {
  const links = userType === "patient" ? patientLinks : doctorLinks;
  const isActive = (path: string) => location.pathname === path;

  return (
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
          onClick={onLinkClick}
        >
          <link.icon className="h-5 w-5" />
          <span>{link.name}</span>
        </Link>
      ))}
    </nav>
  );
};
