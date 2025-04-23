
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
}

interface PatientInfoCardProps {
  patient: Patient;
  heartRate: number;
  selectedPatient: string;
  onPatientChange: (value: string) => void;
  patients: Patient[];
}

export function PatientInfoCard({
  patient,
  heartRate,
  selectedPatient,
  onPatientChange,
  patients
}: PatientInfoCardProps) {
  return (
    <div className="space-y-2">
      <Label>Patient Details</Label>
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
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Heart Rate</span>
              <span className="text-sm font-medium">{heartRate} BPM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
