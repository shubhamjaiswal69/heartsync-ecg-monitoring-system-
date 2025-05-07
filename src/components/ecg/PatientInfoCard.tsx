
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface PatientInfoCardProps {
  patient: Patient;
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  // Determine the condition severity for badge color
  const getSeverityBadge = (condition: string) => {
    if (condition.toLowerCase().includes('arrhythmia') || 
        condition.toLowerCase().includes('attack') || 
        condition.toLowerCase().includes('failure')) {
      return "destructive";
    } else if (condition.toLowerCase().includes('hypertension') ||
               condition.toLowerCase().includes('tachycardia')) {
      // Change from "warning" to "secondary" since "warning" is not a supported variant
      return "secondary";
    } else {
      return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium">{patient.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Age</span>
            <span className="text-sm font-medium">{patient.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Condition</span>
            <Badge variant={getSeverityBadge(patient.condition)}>
              {patient.condition}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
