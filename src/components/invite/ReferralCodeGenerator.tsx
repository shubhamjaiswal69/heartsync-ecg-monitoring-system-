
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ReferralCodeGenerator() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch doctor's referral code on component mount
  useEffect(() => {
    fetchDoctorCode();
  }, []);

  const fetchDoctorCode = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to use this feature.",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching code for user:", user.id);

      // Check if doctor already has a referral code
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Profile data:", data);

      if (data && data.referral_code) {
        setReferralCode(data.referral_code);
      } else {
        // If no referral code exists, generate one automatically
        await generateNewCode(user.id);
      }
    } catch (error) {
      console.error("Error fetching referral code:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewCode = async (userId: string) => {
    try {
      // Generate a more reliable random code with DR prefix
      const code = `DR${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      console.log("Generated new code:", code);

      // Update the doctor's profile with the new referral code
      const { error } = await supabase
        .from('profiles')
        .update({ referral_code: code })
        .eq('id', userId);

      if (error) {
        console.error("Error updating profile with new code:", error);
        throw error;
      }

      setReferralCode(code);
      
      toast({
        title: "Success",
        description: "New referral code generated successfully.",
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

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to use this feature.",
          variant: "destructive",
        });
        return;
      }

      await generateNewCode(user.id);
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleRefresh = () => {
    fetchDoctorCode();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share this code with patients to let them connect with you
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {referralCode ? (
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
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
        ) : (
          <div className="text-center text-muted-foreground">
            {loading ? "Loading..." : "No referral code generated yet"}
          </div>
        )}
        
        <Button 
          onClick={handleGenerateCode} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Processing..." : referralCode ? "Generate New Code" : "Generate Code"}
        </Button>
      </CardContent>
    </Card>
  );
}
