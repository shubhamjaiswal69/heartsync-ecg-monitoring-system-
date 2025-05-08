
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DoctorConnection } from "./useDoctorConnections";

type ConfirmRemoveDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: DoctorConnection | null;
  onConfirm: () => void;
  isRemoving: boolean;
};

export function ConfirmRemoveDialog({
  isOpen,
  onOpenChange,
  doctor,
  onConfirm,
  isRemoving
}: ConfirmRemoveDialogProps) {
  const getDoctorName = (doctor: DoctorConnection | null) => {
    if (!doctor) return "this doctor";
    
    const { first_name, last_name, email } = doctor.doctor;
    
    if (first_name && last_name) {
      return `Dr. ${first_name} ${last_name}`;
    } else if (first_name) {
      return `Dr. ${first_name}`;
    } else {
      return email;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Doctor Connection</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {getDoctorName(doctor)} from your connected doctors? 
            They will no longer be able to view your ECG data or provide remote consultations.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isRemoving}
          >
            Remove Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
