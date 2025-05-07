
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients } from "@/data/mockEcgData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PatientSelectorProps {
  selectedPatient: string;
  onPatientChange: (value: string) => void;
}

export function PatientSelector({ selectedPatient, onPatientChange }: PatientSelectorProps) {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch doctor's referral code
  useEffect(() => {
    const fetchReferralCode = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (data && data.referral_code) {
        setReferralCode(data.referral_code);
      }
    };

    fetchReferralCode();
  }, []);

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
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your Referral Code</CardTitle>
            <CardDescription className="text-xs">
              Share this code with patients to connect
            </CardDescription>
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
