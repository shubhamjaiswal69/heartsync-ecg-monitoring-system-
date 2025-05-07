
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

type Doctor = {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

type Invitation = {
  id: string;
  status: string;
}

export function DoctorInviteForm() {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!referralCode.trim()) {
      setError("Please enter a referral code.");
      return;
    }

    try {
      setLoading(true);

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      console.log("Looking for doctor with referral code:", referralCode.trim());

      // Find the doctor with this referral code
      const { data: doctors, error: doctorError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('referral_code', referralCode.trim())
        .eq('role', 'doctor');

      if (doctorError) {
        console.error("Error finding doctor:", doctorError);
        throw doctorError;
      }

      console.log("Found doctors:", doctors);

      if (!doctors || doctors.length === 0) {
        setError("Invalid referral code. Please check and try again.");
        return;
      }

      const doctor = doctors[0] as Doctor;
      console.log("Selected doctor:", doctor);

      // Check if invitation already exists
      const { data: existingInvites, error: existingError } = await supabase
        .from('doctor_patient_relationships')
        .select('id, status')
        .eq('doctor_id', doctor.id)
        .eq('patient_id', user.id);

      if (existingError) {
        console.error("Error checking existing invites:", existingError);
        throw existingError;
      }

      console.log("Existing invites:", existingInvites);

      const existingInvite = existingInvites && existingInvites.length > 0 
        ? existingInvites[0] as Invitation 
        : null;

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
        console.error("Error creating invitation:", inviteError);
        throw inviteError;
      }

      toast({
        title: "Invitation sent",
        description: `Your invitation has been sent to Dr. ${doctor.first_name} ${doctor.last_name}.`,
      });
      
      setReferralCode("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      setError(error instanceof Error ? error.message : "Failed to send invitation.");
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
          {error && (
            <Alert variant="destructive" className="bg-red-500 text-white border-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="referral-code">Doctor's Referral Code</Label>
            <Input
              id="referral-code"
              placeholder="Enter code (e.g. DR1A2B)"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value);
                setError(null);
              }}
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
