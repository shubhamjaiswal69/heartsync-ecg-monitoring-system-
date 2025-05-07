
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <Card>
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
            <span className="text-sm font-medium">{patient.condition}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
