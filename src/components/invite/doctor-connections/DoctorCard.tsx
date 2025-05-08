
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DoctorConnection } from "./useDoctorConnections";

type DoctorCardProps = {
  connection: DoctorConnection;
  isRemoving: boolean;
  onRemove: () => void;
};

export function DoctorCard({ connection, isRemoving, onRemove }: DoctorCardProps) {
  const { doctor } = connection;
  
  const getDoctorInitials = () => {
    const first = doctor.first_name?.[0] || '';
    const last = doctor.last_name?.[0] || '';
    return (first + last).toUpperCase() || doctor.email[0].toUpperCase();
  };

  const getDoctorName = () => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return `Dr. ${doctor.first_name}`;
    } else {
      return doctor.email;
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-primary">
          <AvatarFallback>{getDoctorInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{getDoctorName()}</p>
          <p className="text-xs text-muted-foreground">{doctor.email}</p>
        </div>
      </div>
      <Button 
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={isRemoving}
        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
}
