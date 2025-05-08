
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DoctorInvitation } from "./usePendingInvitations";

type InvitationCardProps = {
  invitation: DoctorInvitation;
  isCancelling: boolean;
  onCancel: () => void;
};

export function InvitationCard({ invitation, isCancelling, onCancel }: InvitationCardProps) {
  const { doctor } = invitation;
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-primary">
          <AvatarFallback>{getDoctorInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{getDoctorName()}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            <span>Invited on {formatDate(invitation.created_at)}</span>
          </div>
        </div>
      </div>
      <Button 
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isCancelling}
      >
        <Calendar size={14} className="mr-2" />
        Cancel
      </Button>
    </div>
  );
}
