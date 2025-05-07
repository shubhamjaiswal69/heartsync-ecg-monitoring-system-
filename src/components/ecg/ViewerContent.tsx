
import { PatientSelector } from "./PatientSelector";
import { PatternSelector } from "./PatternSelector";
import { LiveModeToggle } from "./LiveModeToggle";
import { DeviceInfoCard } from "./DeviceInfoCard";
import { PatientInfoCard } from "./PatientInfoCard";
import { SessionInfoCard } from "./SessionInfoCard";
import { patients } from "@/data/mockEcgData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, AlertCircle, CheckCircle } from "lucide-react";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { useLiveECGSession } from "@/hooks/useLiveECGSession";

interface ViewerContentProps {
  selectedPatient: string;
  onPatientChange: (patientId: string) => void;
  patternType: string;
  onPatternChange: (pattern: string) => void;
  isLive: boolean;
  onLiveToggle: (checked: boolean) => void;
  heartRate: number;
  isDoctor?: boolean;
}

export function ViewerContent({
  selectedPatient,
  onPatientChange,
  patternType,
  onPatternChange,
  isLive,
  onLiveToggle,
  heartRate,
  isDoctor = false
}: ViewerContentProps) {
  // Try to load real patient profile from Supabase
  const { profile, loading: loadingProfile } = usePatientProfile(selectedPatient);
  const { session, loading: loadingSession } = useLiveECGSession(selectedPatient);
  
  // Fall back to mock data if no real patient data is available
  const mockPatient = patients.find(p => p.id === selectedPatient) || patients[0];
  
  // Determine if we're using a real patient or mock data
  const isRealPatient = !!profile;
  
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
        
        {isDoctor && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Analysis Tools</CardTitle>
              <CardDescription>Tools for ECG interpretation</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[160px] px-1">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <h4 className="text-sm font-medium">Rate Analysis</h4>
                      <p className="text-xs text-muted-foreground">Heart rate is {heartRate > 100 ? 'elevated' : heartRate < 60 ? 'low' : 'normal'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <h4 className="text-sm font-medium">Rhythm Analysis</h4>
                      <p className="text-xs text-muted-foreground">
                        {patternType === 'normal' ? 'Normal sinus rhythm' : 
                         patternType === 'tachycardia' ? 'Tachycardia detected' : 
                         'Irregular rhythm detected'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
                    <div>
                      <h4 className="text-sm font-medium">Anomaly Detection</h4>
                      <p className="text-xs text-muted-foreground">
                        {patternType === 'arrhythmia' ? 'Potential arrhythmia detected' : 'No anomalies detected'}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="md:col-span-2 space-y-4">
        <DeviceInfoCard />
        {isRealPatient ? (
          <PatientInfoCard patient={profile} loading={loadingProfile} />
        ) : (
          <PatientInfoCard 
            patient={{
              id: mockPatient.id,
              full_name: mockPatient.name,
              age: mockPatient.age,
              gender: null,
              blood_type: null,
              height: null,
              weight: null,
              medical_history: mockPatient.condition,
              allergies: null,
              current_medications: null,
              emergency_contact: null
            }} 
          />
        )}
        <SessionInfoCard 
          isRecording={isLive} 
          minHeartRate={session?.current_heart_rate || heartRate - 2} 
          maxHeartRate={session?.current_heart_rate || heartRate + 5} 
          avgHeartRate={session?.current_heart_rate || heartRate} 
        />
      </div>
    </div>
  );
}
