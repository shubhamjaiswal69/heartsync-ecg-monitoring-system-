
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePreviousPatientConnections, PatientConnection } from "./patient-connections/usePreviousPatientConnections";

export function PreviousPatientConnections() {
  const { previousConnections, loading, refreshConnections } = usePreviousPatientConnections();
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const [patientReferralCodes, setPatientReferralCodes] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const getPatientInitials = (patient: PatientConnection['patient']) => {
    const first = patient.first_name?.[0] || '';
    const last = patient.last_name?.[0] || '';
    return (first + last).toUpperCase() || patient.email[0].toUpperCase();
  };

  const getPatientName = (patient: PatientConnection['patient']) => {
    if (patient.first_name && patient.last_name) {
      return `${patient.first_name} ${patient.last_name}`;
    } else if (patient.first_name) {
      return patient.first_name;
    } else {
      return patient.email;
    }
  };

  const generateReferralCode = async (patientId: string) => {
    try {
      setGeneratingCode(patientId);
      
      // Get current user (doctor)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to generate a referral code");
      
      // Get doctor's referral code
      const { data: doctorData, error: doctorError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      if (doctorError) throw doctorError;
      
      if (!doctorData.referral_code) {
        // Generate a new one if needed
        const code = `DR${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ referral_code: code })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        setPatientReferralCodes(prev => ({ ...prev, [patientId]: code }));
      } else {
        setPatientReferralCodes(prev => ({ ...prev, [patientId]: doctorData.referral_code }));
      }
      
      toast({
        title: "Referral Code Generated",
        description: "Share this code with your patient to reconnect",
      });
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(null);
    }
  };

  const handleCopyCode = async (patientId: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(patientId);
    toast({
      title: "Copied",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previously Connected Patients</CardTitle>
        <CardDescription>
          Patients who have removed their connection with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading previous connections...</div>
        ) : previousConnections.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You have no previously removed patient connections
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                To reconnect with these patients, you'll need to generate a new referral code and share it with them.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {previousConnections.map((connection) => (
                <div key={connection.id} className="p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-primary/20">
                        <AvatarFallback>{getPatientInitials(connection.patient)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{getPatientName(connection.patient)}</p>
                        <p className="text-xs text-muted-foreground">{connection.patient.email}</p>
                        {connection.removed_at && (
                          <p className="text-xs text-muted-foreground">
                            Removed {formatDistanceToNow(new Date(connection.removed_at), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                    {!patientReferralCodes[connection.patient.id] && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => generateReferralCode(connection.patient.id)}
                        disabled={generatingCode === connection.patient.id}
                        className="text-primary"
                      >
                        {generatingCode === connection.patient.id ? "Generating..." : "Generate Code"}
                      </Button>
                    )}
                  </div>
                  
                  {patientReferralCodes[connection.patient.id] && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-primary/10 rounded">
                      <code className="text-sm font-mono">{patientReferralCodes[connection.patient.id]}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleCopyCode(connection.patient.id, patientReferralCodes[connection.patient.id])}
                      >
                        {copiedCode === connection.patient.id ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
