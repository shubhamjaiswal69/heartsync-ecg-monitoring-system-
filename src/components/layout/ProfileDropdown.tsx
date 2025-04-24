
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export function ProfileDropdown() {
  const { profile, signOut } = useAuth();
  
  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary/10">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.first_name} {profile?.last_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/${profile?.role}/profile`}>
            <UserRound className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => signOut()}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
