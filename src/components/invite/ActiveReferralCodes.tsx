
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteCode {
  id: string;
  code: string;
  expires_at: string;
  used: boolean;
}

export function ActiveReferralCodes() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('invite_codes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invite_codes',
        },
        () => {
          fetchCodes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCodes = async () => {
    const { data, error } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('used', false)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch referral codes.",
        variant: "destructive",
      });
      return;
    }

    setCodes(data || []);
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    toast({
      title: "Copied",
      description: "Referral code copied to clipboard.",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Referral Codes</CardTitle>
        <CardDescription>
          Share these codes with your doctors to connect
        </CardDescription>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active referral codes</p>
        ) : (
          <div className="space-y-4">
            {codes.map((code) => (
              <div
                key={code.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-mono font-medium">{code.code}</p>
                  <p className="text-sm text-muted-foreground">
                    Expires: {new Date(code.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyCode(code.code)}
                >
                  {copied === code.code ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
