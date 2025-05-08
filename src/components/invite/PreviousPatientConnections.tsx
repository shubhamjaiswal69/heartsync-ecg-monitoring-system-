
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { usePreviousPatientConnections, PatientConnection } from "./patient-connections/usePreviousPatientConnections";

export function PreviousPatientConnections() {
  const { previousConnections, loading } = usePreviousPatientConnections();

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
                <div key={connection.id} className="flex items-center justify-between gap-3 p-3 bg-muted rounded-md">
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
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
