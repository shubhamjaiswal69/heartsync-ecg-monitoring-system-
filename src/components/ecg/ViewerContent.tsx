
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PatientSelector } from "./PatientSelector";
import { PatternSelector } from "./PatternSelector";
import { LiveModeToggle } from "./LiveModeToggle";
import { PatientInfoCard } from "./PatientInfoCard";
import { HeartRateCard } from "./HeartRateCard";
import { patients } from "@/data/mockEcgData";

interface ViewerContentProps {
  selectedPatient: string;
  onPatientChange: (value: string) => void;
  patternType: string;
  onPatternChange: (value: string) => void;
  isLive: boolean;
  onLiveToggle: (checked: boolean) => void;
  heartRate: number;
}

export function ViewerContent({
  selectedPatient,
  onPatientChange,
  patternType,
  onPatternChange,
  isLive,
  onLiveToggle,
  heartRate
}: ViewerContentProps) {
  const patient = patients.find(p => p.id === selectedPatient) || patients[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Select a patient to view their ECG data
            </CardDescription>
          </div>
          <LiveModeToggle isLive={isLive} onToggle={onLiveToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <PatientSelector
              selectedPatient={selectedPatient}
              onPatientChange={onPatientChange}
            />
            <PatternSelector
              patternType={patternType}
              onPatternChange={onPatternChange}
            />
          </div>
          <PatientInfoCard
            patient={patient}
            heartRate={heartRate}
            selectedPatient={selectedPatient}
            onPatientChange={onPatientChange}
            patients={patients}
          />
        </div>
      </CardContent>
    </Card>
  );
}
