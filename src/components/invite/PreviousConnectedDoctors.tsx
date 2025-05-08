
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useDoctorConnections, DoctorConnection } from "./doctor-connections/useDoctorConnections";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function PreviousConnectedDoctors() {
  const { previousConnections, loading } = useDoctorConnections();

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
            <Alert variant="info" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                To reconnect with any of these doctors, you'll need to receive a new invitation code from them.
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
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
