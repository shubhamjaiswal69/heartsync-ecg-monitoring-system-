
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients } from "@/data/mockEcgData";

interface PatientSelectorProps {
  selectedPatient: string;
  onPatientChange: (value: string) => void;
}

export function PatientSelector({ selectedPatient, onPatientChange }: PatientSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select Patient</Label>
      <Select value={selectedPatient} onValueChange={onPatientChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Patient" />
        </SelectTrigger>
        <SelectContent>
          {patients.map(patient => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.name} ({patient.age})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
