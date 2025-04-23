import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { HeartRateCard } from "@/components/ecg/HeartRateCard";
import { PatientInfoCard } from "@/components/ecg/PatientInfoCard";
import { ECGChart } from "@/components/ecg/ECGChart";
import { NotesSection } from "@/components/ecg/NotesSection";
import { PatternSelector } from "@/components/ecg/PatternSelector";
import { LiveModeToggle } from "@/components/ecg/LiveModeToggle";
import { AnalysisTab } from "@/components/ecg/AnalysisTab";
import { HistoryTab } from "@/components/ecg/HistoryTab";

// Mock patients data - keep the same as before
const patients = [
  { id: "1", name: "John Doe", age: 45, condition: "Arrhythmia" },
  { id: "2", name: "Sarah Johnson", age: 62, condition: "Hypertension" },
  { id: "3", name: "Michael Smith", age: 57, condition: "Post-heart attack" }
];

// Mock ECG data generation function - keep the same as before
const generateECGData = (patternType = "normal", length = 100) => {
  const mockData = [];
  const baseValue = 80;
  
  for (let i = 0; i < length; i++) {
    let value = baseValue;
    
    if (patternType === "normal") {
      // Regular heartbeat pattern
      if (i % 20 === 0) value += 40; // R wave (peak)
      else if (i % 20 === 1) value -= 30; // S wave (trough)
      else if (i % 20 === 5) value += 10; // T wave
      else if (i % 20 === 10) value -= 5; // Q wave
    } 
    else if (patternType === "arrhythmia") {
      // Irregular pattern
      if (i % 20 === 0) value += 40;
      else if (i % 20 === 1) value -= 30;
      else if (i % 16 === 0) value += 30; // Extra beat
      else if (i % 20 === 5) value += 10;
    }
    else if (patternType === "tachycardia") {
      // Faster pattern
      if (i % 15 === 0) value += 40;
      else if (i % 15 === 1) value -= 30;
      else if (i % 15 === 4) value += 10;
    }
    
    // Add some randomness
    value += Math.random() * 5;
    
    mockData.push({
      time: i,
      value: value
    });
  }
  return mockData;
};

const DoctorECGViewer = () => {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "1");
  const [patternType, setPatternType] = useState("normal");
  const [ecgData, setEcgData] = useState(generateECGData(patternType));
  const [isLive, setIsLive] = useState(false);
  const [notes, setNotes] = useState("");
  const [heartRate, setHeartRate] = useState(75);
  const { toast } = useToast();
  
  const patient = patients.find(p => p.id === selectedPatient) || patients[0];
  
  const handlePatientChange = (value: string) => {
    setSelectedPatient(value);
  };
  
  const handlePatternChange = (value: string) => {
    setPatternType(value);
    setEcgData(generateECGData(value));
    
    if (value === "normal") setHeartRate(72);
    else if (value === "tachycardia") setHeartRate(110);
    else if (value === "arrhythmia") setHeartRate(88);
  };
  
  const handleLiveToggle = (checked: boolean) => {
    setIsLive(checked);
    
    if (checked) {
      const interval = setInterval(() => {
        setEcgData(generateECGData(patternType));
        setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 1000);
      
      window.sessionStorage.setItem('doctorEcgInterval', interval.toString());
    } else {
      const intervalId = window.sessionStorage.getItem('doctorEcgInterval');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        window.sessionStorage.removeItem('doctorEcgInterval');
      }
    }
  };
  
  const handleSaveNotes = () => {
    if (!notes.trim()) return;
    
    toast({
      title: "Notes Saved",
      description: "Patient notes have been saved successfully."
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "ECG report has been generated and is ready for download."
    });
  };
  
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ECG Viewer</h1>
            <p className="text-muted-foreground">
              View and analyze patient ECG data
            </p>
          </div>
          <HeartRateCard heartRate={heartRate} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Select a patient to view their ECG data
                </CardDescription>
              </div>
              <LiveModeToggle isLive={isLive} onToggle={handleLiveToggle} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select value={selectedPatient} onValueChange={handlePatientChange}>
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
                
                <PatternSelector 
                  patternType={patternType}
                  onPatternChange={handlePatternChange}
                />
              </div>
              
              <PatientInfoCard
                patient={patient}
                heartRate={heartRate}
                selectedPatient={selectedPatient}
                onPatientChange={handlePatientChange}
                patients={patients}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="real-time">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="real-time">Real-time View</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="real-time" className="space-y-4">
            <ECGChart 
              ecgData={ecgData}
              isLive={isLive}
              onGenerateReport={handleGenerateReport}
            />
            
            <NotesSection
              notes={notes}
              onNotesChange={setNotes}
              onSaveNotes={handleSaveNotes}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            <AnalysisTab />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorECGViewer;
