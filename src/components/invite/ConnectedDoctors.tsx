
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDoctorConnections, DoctorConnection } from "./doctor-connections/useDoctorConnections";
import { DoctorCard } from "./doctor-connections/DoctorCard";
import { ConfirmRemoveDialog } from "./doctor-connections/ConfirmRemoveDialog";
import { useToast } from "@/hooks/use-toast";

export function ConnectedDoctors() {
  const { connections, loading, removingConnection, removeDoctor } = useDoctorConnections();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorConnection | null>(null);
  const { toast } = useToast();

  const handleRemoveDoctor = (connection: DoctorConnection) => {
    setSelectedDoctor(connection);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveDoctor = async () => {
    if (!selectedDoctor) return;
    
    const success = await removeDoctor(selectedDoctor.id);
    
    if (success) {
      const doctorName = getDoctorName(selectedDoctor.doctor);
      toast({
        title: "Success",
        description: `${doctorName} has been removed from your connected doctors.`,
      });
    }
    
    setConfirmDialogOpen(false);
    setSelectedDoctor(null);
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
                <DoctorCard
                  key={connection.id}
                  connection={connection}
                  isRemoving={removingConnection === connection.id}
                  onRemove={() => handleRemoveDoctor(connection)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmRemoveDialog
        isOpen={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        doctor={selectedDoctor}
        onConfirm={confirmRemoveDoctor}
        isRemoving={removingConnection !== null}
      />
    </>
  );
}
