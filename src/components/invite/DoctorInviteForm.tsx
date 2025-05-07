
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
  email: string;
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

      const trimmedCode = referralCode.trim().toUpperCase(); // Normalize the code
      console.log("Looking for doctor with referral code:", trimmedCode);

      // Use the new security definer function to find doctor
      const { data: doctorId, error: functionError } = await supabase
        .rpc('get_doctor_by_referral_code', { code: trimmedCode });

      if (functionError) {
        console.error("Error finding doctor:", functionError);
        throw functionError;
      }

      if (!doctorId) {
        setError("Invalid referral code. Please check and try again.");
        return;
      }

      console.log("Found doctor with ID:", doctorId);
      
      // Don't allow connecting to yourself
      if (doctorId === user.id) {
        setError("You cannot connect with yourself.");
        return;
      }

      // Check if invitation already exists
      const { data: existingInvites, error: existingError } = await supabase
        .from('doctor_patient_relationships')
        .select('id, status')
        .eq('doctor_id', doctorId)
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
          // Get the doctor's name for the toast message
          const { data: doctorProfile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', doctorId)
            .single();

          if (profileError) {
            console.error("Error fetching doctor profile:", profileError);
            throw profileError;
          }

          const doctorName = getDoctorName(doctorProfile as Doctor);
          toast({
            title: "Already connected",
            description: `You are already connected with Dr. ${doctorName}`,
          });
          setReferralCode("");
          return;
        } else if (existingInvite.status === 'pending') {
          // Get the doctor's name for the toast message
          const { data: doctorProfile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', doctorId)
            .single();

          if (profileError) {
            console.error("Error fetching doctor profile:", profileError);
            throw profileError;
          }

          const doctorName = getDoctorName(doctorProfile as Doctor);
          toast({
            title: "Invitation pending",
            description: `You already have a pending invitation to Dr. ${doctorName}`,
          });
          setReferralCode("");
          return;
        }
        // If rejected, we'll allow them to send a new invitation
      }

      // Create a new invitation - protected by the "Patients can create connection requests" policy
      const { error: inviteError } = await supabase
        .from('doctor_patient_relationships')
        .insert({
          doctor_id: doctorId,
          patient_id: user.id,
          status: 'pending',
          referral_code: trimmedCode
        });

      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        throw inviteError;
      }

      // Get the doctor's name for the toast message
      const { data: doctorProfile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', doctorId)
        .single();

      if (profileError) {
        console.error("Error fetching doctor profile:", profileError);
        throw profileError;
      }

      const doctorName = getDoctorName(doctorProfile as Doctor);
      toast({
        title: "Invitation sent",
        description: `Your invitation has been sent to Dr. ${doctorName}`,
      });
      
      setReferralCode("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      setError(error instanceof Error ? error.message : "Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (doctor: Doctor) => {
    if (doctor.first_name && doctor.last_name) {
      return `${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return doctor.first_name;
    } else {
      return doctor.email;
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
                setReferralCode(e.target.value.toUpperCase()); // Convert to uppercase while typing
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
