
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

export function DoctorInviteForm() {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Find the doctor with this referral code
      const { data: doctor, error: doctorError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('referral_code', referralCode.trim())
        .eq('role', 'doctor')
        .maybeSingle();

      if (doctorError || !doctor) {
        throw new Error("Invalid referral code. Please check and try again.");
      }

      // Check if invitation already exists
      const { data: existingInvite, error: existingError } = await supabase
        .from('doctor_patient_relationships')
        .select('id, status')
        .eq('doctor_id', doctor.id)
        .eq('patient_id', user.id)
        .maybeSingle();

      if (existingInvite) {
        if (existingInvite.status === 'accepted') {
          toast({
            title: "Already connected",
            description: `You are already connected with Dr. ${doctor.first_name} ${doctor.last_name}.`,
          });
          setReferralCode("");
          return;
        } else if (existingInvite.status === 'pending') {
          toast({
            title: "Invitation pending",
            description: `You already have a pending invitation to Dr. ${doctor.first_name} ${doctor.last_name}.`,
          });
          setReferralCode("");
          return;
        }
        // If rejected, we'll allow them to send a new invitation
      }

      // Create a new invitation
      const { error: inviteError } = await supabase
        .from('doctor_patient_relationships')
        .insert({
          doctor_id: doctor.id,
          patient_id: user.id,
          status: 'pending',
          referral_code: referralCode.trim()
        });

      if (inviteError) {
        throw inviteError;
      }

      toast({
        title: "Invitation sent",
        description: `Your invitation has been sent to Dr. ${doctor.first_name} ${doctor.last_name}.`,
      });
      
      setReferralCode("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect with a Doctor</CardTitle>
        <CardDescription>
          Enter your doctor's referral code to connect with them
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral-code">Doctor's Referral Code</Label>
            <Input
              id="referral-code"
              placeholder="Enter code (e.g. DR1A2B)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !referralCode.trim()}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
