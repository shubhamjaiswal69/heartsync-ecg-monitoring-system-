
import { PatientSelector } from "./PatientSelector";
import { PatternSelector } from "./PatternSelector";
import { LiveModeToggle } from "./LiveModeToggle";
import { DeviceInfoCard } from "./DeviceInfoCard";
import { PatientInfoCard } from "./PatientInfoCard";
import { SessionInfoCard } from "./SessionInfoCard";

interface ViewerContentProps {
  selectedPatient: string;
  onPatientChange: (patientId: string) => void;
  patternType: string;
  onPatternChange: (pattern: string) => void;
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <PatientSelector 
          selectedPatient={selectedPatient} 
          onPatientChange={onPatientChange} 
        />
        <PatternSelector 
          patternType={patternType} 
          onPatternChange={onPatternChange} 
        />
        <LiveModeToggle 
          isLive={isLive} 
          onToggle={onLiveToggle} 
        />
      </div>
      <div className="md:col-span-2 space-y-4">
        <DeviceInfoCard />
        <PatientInfoCard patient={selectedPatient} />
        <SessionInfoCard minHeartRate={heartRate} maxHeartRate={heartRate + 5} avgHeartRate={heartRate} />
      </div>
    </div>
  );
}
