
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients } from "@/data/mockEcgData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientSelectorProps {
  selectedPatient: string;
  onPatientChange: (value: string) => void;
}

export function PatientSelector({ selectedPatient, onPatientChange }: PatientSelectorProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch doctor's referral code
  useEffect(() => {
    fetchReferralCode();
  }, []);

  const fetchReferralCode = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      console.log("Fetching referral code for user:", user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching referral code:", error);
        return;
      }

      console.log("Profile data:", data);

      // Only proceed if this is a doctor user
      if (data && data.role === 'doctor') {
        if (data.referral_code) {
          setReferralCode(data.referral_code);
        } else {
          // If no referral code exists, generate one automatically
          await generateNewCode(user.id);
        }
      }
    } catch (error) {
      console.error("Error in fetchReferralCode:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewCode = async (userId: string) => {
    try {
      // Generate a random code with a consistent format - always prefix with DR and use uppercase
      const code = `DR${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      console.log("Generated new code:", code);

      // Update the doctor's profile with the new referral code
      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: code })
        .eq('id', userId);

      if (error) {
        console.error("Error updating referral code:", error);
        toast({
          title: "Error",
          description: "Failed to generate referral code.",
          variant: "destructive",
        });
        return;
      }

      setReferralCode(code);
      toast({
        title: "Success",
        description: "New referral code generated.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral code.",
        variant: "destructive",
      });
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Referral code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await generateNewCode(user.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Patient</Label>
        <Select value={selectedPatient} onValueChange={onPatientChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map(patient => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name} ({patient.age})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {referralCode && (
        <Card className="mt-4">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Your Referral Code</CardTitle>
              <CardDescription className="text-xs">
                Share this code with patients to connect
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              className="h-6 w-6 p-0"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="font-mono font-medium">{referralCode}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyCode}
                className="h-8 w-8 p-0"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
