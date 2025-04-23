
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function AddPatientDialog() {
  const [referralCode, setReferralCode] = useState("");
  const { toast } = useToast();

  const handleAddPatient = () => {
    if (!referralCode.trim()) return;
    
    toast({
      title: "Patient connection requested",
      description: "Your request has been sent. Waiting for patient approval."
    });
    
    setReferralCode("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's referral code to connect with them.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="referral-code">Referral Code</Label>
            <Input 
              id="referral-code"
              placeholder="e.g., HEARTSYNC-12345"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddPatient}>Connect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
