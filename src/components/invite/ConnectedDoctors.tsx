
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserX } from "lucide-react";

type DoctorConnection = {
  id: string;
  doctor_id: string;
  status: string;
  doctor: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function ConnectedDoctors() {
  const [connections, setConnections] = useState<DoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchConnections = async () => {
    try {
      setLoading(true);
      
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get all accepted connections
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          doctor_id,
          status,
          doctor:doctor_id(first_name, last_name, email)
        `)
        .eq('patient_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      setConnections(data as unknown as DoctorConnection[]);
    } catch (error) {
      console.error("Error fetching doctor connections:", error);
      toast({
        title: "Error",
        description: "Failed to load your connected doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleRemoveConnection = async (connectionId: string) => {
    try {
      setRemoving(connectionId);
      
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      // Update local state
      setConnections(connections.filter(conn => conn.id !== connectionId));
      
      toast({
        title: "Connection removed",
        description: "The doctor has been disconnected from your account.",
      });
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove the connection.",
        variant: "destructive",
      });
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Doctors</CardTitle>
        <CardDescription>
          Healthcare professionals who can view your data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading connections...</div>
        ) : connections.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No connected doctors</div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Dr. {connection.doctor.first_name} {connection.doctor.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{connection.doctor.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRemoveConnection(connection.id)}
                  disabled={removing === connection.id}
                  className="flex items-center gap-1"
                >
                  <UserX size={16} />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
