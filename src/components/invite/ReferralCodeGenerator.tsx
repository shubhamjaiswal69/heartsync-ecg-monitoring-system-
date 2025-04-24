
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ReferralCodeGenerator() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      
      const { data: existingCodes } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('used', false)
        .maybeSingle();

      if (existingCodes) {
        toast({
          title: "Active code exists",
          description: "You already have an active referral code.",
        });
        return;
      }

      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate a random code instead of using the stored procedure
      const code = `HEARTSYNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Insert the new code with all required fields
      const { data, error } = await supabase
        .from('invite_codes')
        .insert({
          code: code,
          patient_id: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        })
        .select()
        .single();

      if (error) throw error;

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
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Referral code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Referral Code</CardTitle>
        <CardDescription>
          Create a unique referral code to share with your doctor
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerateCode} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate New Code"}
        </Button>
      </CardContent>
    </Card>
  );
}
