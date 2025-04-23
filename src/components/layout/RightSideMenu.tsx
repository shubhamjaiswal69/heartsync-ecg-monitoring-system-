
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Users, Activity, FileText, LogOut } from "lucide-react";

interface RightSideMenuProps {
  userType: "patient" | "doctor";
  onLogout: () => void;
}

const RightSideMenu = ({ userType, onLogout }: RightSideMenuProps) => {
  const links = userType === "doctor" ? [
    { name: "Dashboard", path: "/doctor/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Patients", path: "/doctor/patients", icon: <Users className="h-5 w-5" /> },
    { name: "ECG Viewer", path: "/doctor/ecg-viewer", icon: <Activity className="h-5 w-5" /> },
    { name: "Reports", path: "/doctor/reports", icon: <FileText className="h-5 w-5" /> }
  ] : [
    { name: "Dashboard", path: "/patient/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "ECG Viewer", path: "/patient/ecg-viewer", icon: <Activity className="h-5 w-5" /> },
    { name: "Reports", path: "/patient/reports", icon: <FileText className="h-5 w-5" /> }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-accent"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <Button 
            variant="ghost" 
            className="flex items-center gap-3 px-4 py-3 mt-4 w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RightSideMenu;
