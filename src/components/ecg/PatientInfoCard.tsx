
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { type PatientProfile } from "@/hooks/usePatientProfile";

interface PatientInfoCardProps {
  patient: PatientProfile | null;
  loading?: boolean;
}

export function PatientInfoCard({ patient, loading = false }: PatientInfoCardProps) {
  // Determine the condition severity for badge color
  const getSeverityBadge = (condition: string) => {
    if (condition.toLowerCase().includes('arrhythmia') || 
        condition.toLowerCase().includes('attack') || 
        condition.toLowerCase().includes('failure')) {
      return "destructive";
    } else if (condition.toLowerCase().includes('hypertension') ||
               condition.toLowerCase().includes('tachycardia')) {
      return "secondary";
    } else {
      return "secondary";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex justify-center items-center h-32">
          <Spinner className="h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            No patient data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium">{patient.full_name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Age</span>
            <span className="text-sm font-medium">{patient.age ? `${patient.age} years` : "N/A"}</span>
          </div>
          {patient.gender && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Gender</span>
              <span className="text-sm font-medium">{patient.gender}</span>
            </div>
          )}
          {patient.blood_type && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Blood Type</span>
              <span className="text-sm font-medium">{patient.blood_type}</span>
            </div>
          )}
          {(patient.height || patient.weight) && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Physical</span>
              <span className="text-sm font-medium">
                {patient.height ? `${patient.height} cm` : ""} 
                {patient.height && patient.weight ? " | " : ""}
                {patient.weight ? `${patient.weight} kg` : ""}
              </span>
            </div>
          )}
          {patient.medical_history && (
            <div className="pt-2">
              <span className="text-sm text-muted-foreground">Medical History</span>
              <div className="mt-1 text-sm bg-muted p-2 rounded">
                {patient.medical_history}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
