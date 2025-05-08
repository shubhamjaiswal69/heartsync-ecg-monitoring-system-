
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DoctorConnection = {
  id: string;
  doctor: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
};

export function ConnectedDoctors() {
  const [connections, setConnections] = useState<DoctorConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingConnection, setRemovingConnection] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorConnection | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConnectedDoctors();
  }, []);

  const fetchConnectedDoctors = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view your connected doctors.",
          variant: "destructive",
        });
        return;
      }

      // Get all accepted connections where the current user is the patient
      // Protected by the RLS policy "Patients can view invitations they sent"
      const { data, error } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          id,
          doctor:doctor_id(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('patient_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;

      setConnections(data as unknown as DoctorConnection[]);
    } catch (error) {
      console.error("Error fetching connected doctors:", error);
      toast({
        title: "Error",
        description: "Failed to load your connected doctors.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDoctor = (connection: DoctorConnection) => {
    setSelectedDoctor(connection);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveDoctor = async () => {
    if (!selectedDoctor) return;
    
    try {
      setRemovingConnection(selectedDoctor.id);
      
      const { error } = await supabase
        .from('doctor_patient_relationships')
        .delete()
        .eq('id', selectedDoctor.id);
      
      if (error) throw error;
      
      setConnections(prev => prev.filter(conn => conn.id !== selectedDoctor.id));
      
      toast({
        title: "Success",
        description: `${getDoctorName(selectedDoctor.doctor)} has been removed from your connected doctors.`,
      });
    } catch (error) {
      console.error("Error removing doctor connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove doctor connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRemovingConnection(null);
      setConfirmDialogOpen(false);
      setSelectedDoctor(null);
    }
  };

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Connected Doctors</CardTitle>
          <CardDescription>
            Doctors who can access your ECG data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading connections...</div>
          ) : connections.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              You have no connected doctors
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary">
                      <AvatarFallback>{getDoctorInitials(connection.doctor)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getDoctorName(connection.doctor)}</p>
                      <p className="text-xs text-muted-foreground">{connection.doctor.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDoctor(connection)}
                    disabled={removingConnection === connection.id}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Doctor Connection</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedDoctor ? getDoctorName(selectedDoctor.doctor) : "this doctor"} from your connected doctors? 
              They will no longer be able to view your ECG data or provide remote consultations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRemoveDoctor}
              disabled={removingConnection !== null}
            >
              Remove Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
