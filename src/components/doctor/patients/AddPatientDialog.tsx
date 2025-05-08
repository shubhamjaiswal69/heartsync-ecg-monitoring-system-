import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AddPatientDialog() {
  const [referralCode, setReferralCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPatient = async () => {
    if (!referralCode.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to connect with patients.",
          variant: "destructive",
        });
        return;
      }
      
      // Check if there's an existing connection with this patient (including removed ones)
      const { data: existingConnections, error: checkError } = await supabase
        .from('doctor_patient_relationships')
        .select('id, status')
        .eq('doctor_id', user.id)
        .eq('referral_code', referralCode);
      
      if (checkError) throw checkError;
      
      // If there's a removed connection, update it back to pending
      const removedConnection = existingConnections?.find(conn => conn.status === 'removed');
      
      if (removedConnection) {
        const { error: updateError } = await supabase
          .from('doctor_patient_relationships')
          .update({ status: 'pending' })
          .eq('id', removedConnection.id);
        
        if (updateError) throw updateError;
        
        toast({
          title: "Patient connection re-requested",
          description: "Your request has been sent. Waiting for patient approval."
        });
      } else {
        // Otherwise, create a new connection
        const { error: insertError } = await supabase
          .from('doctor_patient_relationships')
          .insert({
            doctor_id: user.id,
            patient_id: '00000000-0000-0000-0000-000000000000', // Placeholder, will be updated by database trigger
            referral_code: referralCode,
            status: 'pending'
          });
        
        if (insertError) throw insertError;
        
        toast({
          title: "Patient connection requested",
          description: "Your request has been sent. Waiting for patient approval."
        });
      }
      
      setReferralCode("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Failed to connect with patient. Please check the referral code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button 
            onClick={handleAddPatient} 
            disabled={isSubmitting || !referralCode.trim()}
          >
            {isSubmitting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
