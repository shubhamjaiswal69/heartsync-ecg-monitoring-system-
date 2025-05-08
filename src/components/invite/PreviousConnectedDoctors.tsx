
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDoctorConnections, DoctorConnection } from "./doctor-connections/useDoctorConnections";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PreviousConnectedDoctors() {
  const { previousConnections, loading, refreshConnections } = useDoctorConnections();
  const [reconnectingDoctor, setReconnectingDoctor] = useState<string | null>(null);
  const { toast } = useToast();

  const getDoctorInitials = (doctor: DoctorConnection['doctor']) => {
    const first = doctor.first_name?.[0] || '';
    const last = doctor.last_name?.[0] || '';
    return (first + last).toUpperCase() || doctor.email[0].toUpperCase();
  };

  const getDoctorName = (doctor: DoctorConnection['doctor']) => {
    if (doctor.first_name && doctor.last_name) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    } else if (doctor.first_name) {
      return `Dr. ${doctor.first_name}`;
    } else {
      return doctor.email;
    }
  };

  const handleReconnect = async (connection: DoctorConnection) => {
    try {
      setReconnectingDoctor(connection.id);
      
      // Get doctor's current referral code
      const { data: doctorData, error: doctorError } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', connection.doctor.id)
        .single();
        
      if (doctorError) throw doctorError;
      
      if (!doctorData.referral_code) {
        toast({
          title: "Cannot Reconnect",
          description: "This doctor doesn't have an active referral code. Please ask them to generate a new one.",
          variant: "destructive",
        });
        return;
      }
      
      // Create a new connection with the doctor's current referral code
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("You must be logged in to reconnect with a doctor");
      
      const { error: insertError } = await supabase
        .from('doctor_patient_relationships')
        .insert({
          doctor_id: connection.doctor.id,
          patient_id: user.id,
          referral_code: doctorData.referral_code,
          status: 'accepted'
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Reconnection successful",
        description: `You are now reconnected with ${getDoctorName(connection.doctor)}.`,
      });
      
      // Refresh the connections list
      refreshConnections();
    } catch (error) {
      console.error("Error reconnecting with doctor:", error);
      toast({
        title: "Reconnection failed",
        description: "There was an error trying to reconnect with this doctor. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setReconnectingDoctor(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previously Connected Doctors</CardTitle>
        <CardDescription>
          Doctors who no longer have access to your medical data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading connections...</div>
        ) : previousConnections.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            You have no previously removed connections
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                To reconnect with any of these doctors, you'll need to receive a new invitation code from them or use the reconnect button.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {previousConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/20">
                      <AvatarFallback>{getDoctorInitials(connection.doctor)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getDoctorName(connection.doctor)}</p>
                      <p className="text-xs text-muted-foreground">{connection.doctor.email}</p>
                      {connection.removed_at && (
                        <p className="text-xs text-muted-foreground">
                          Removed {formatDistanceToNow(new Date(connection.removed_at), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReconnect(connection)}
                    disabled={reconnectingDoctor === connection.id}
                    className="text-primary"
                  >
                    {reconnectingDoctor === connection.id ? "Reconnecting..." : "Reconnect"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
