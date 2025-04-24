
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardNavLinks } from "./DashboardNavLinks";

interface MobileNavigationProps {
  userType: "patient" | "doctor";
  onLogout: () => void;
  loading?: boolean;
}

export const MobileNavigation = ({ userType, onLogout, loading }: MobileNavigationProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[75vw] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">❤️ HeartSync</span>
            </Link>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <DashboardNavLinks userType={userType} />
          
          <div className="mt-auto border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
              disabled={loading}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
