
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Activity, Download, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock patients
const patients = [
  { id: "1", name: "John Doe", age: 45, condition: "Arrhythmia" },
  { id: "2", name: "Sarah Johnson", age: 62, condition: "Hypertension" },
  { id: "3", name: "Michael Smith", age: 57, condition: "Post-heart attack" }
];

// Mock ECG data with different patterns
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

// ECG pattern types with labels
const ecgPatterns = [
  { id: "normal", name: "Normal Sinus Rhythm" },
  { id: "arrhythmia", name: "Arrhythmia" },
  { id: "tachycardia", name: "Tachycardia" }
];

const chartConfig = {
  ecg: {
    label: "ECG",
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5"
    }
  }
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
  
  // Get patient info
  const patient = patients.find(p => p.id === selectedPatient) || patients[0];
  
  const handlePatientChange = (value: string) => {
    setSelectedPatient(value);
    // In a real app, this would fetch the patient's actual ECG data
  };
  
  const handlePatternChange = (value: string) => {
    setPatternType(value);
    setEcgData(generateECGData(value));
    
    // Update heart rate based on pattern
    if (value === "normal") setHeartRate(72);
    else if (value === "tachycardia") setHeartRate(110);
    else if (value === "arrhythmia") setHeartRate(88);
  };
  
  const handleLiveToggle = (checked: boolean) => {
    setIsLive(checked);
    
    // If turning on live view, start updating data
    if (checked) {
      const interval = setInterval(() => {
        setEcgData(generateECGData(patternType));
        // Random fluctuation in heart rate
        setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 1000);
      
      window.sessionStorage.setItem('doctorEcgInterval', interval.toString());
    } else {
      // Clear interval when turning off live view
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
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Heart Rate</p>
                <p className="text-3xl font-bold">{heartRate} <span className="text-base">BPM</span></p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
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
              <div className="flex items-center space-x-2">
                <Switch 
                  id="live-mode" 
                  checked={isLive} 
                  onCheckedChange={handleLiveToggle} 
                />
                <Label htmlFor="live-mode">Live Mode</Label>
              </div>
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
                
                <div className="space-y-2">
                  <Label>View Pattern</Label>
                  <Select value={patternType} onValueChange={handlePatternChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {ecgPatterns.map(pattern => (
                        <SelectItem key={pattern.id} value={pattern.id}>
                          {pattern.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    For demonstration purposes only. Select different patterns to view sample ECG data.
                  </p>
                </div>
              </div>
              
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
            <Card>
              <CardHeader>
                <CardTitle>ECG Waveform</CardTitle>
                <CardDescription>
                  {isLive ? "Live electrocardiogram data" : "Sample electrocardiogram data"}
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                <ChartContainer 
                  className="h-[300px]" 
                  config={chartConfig}
                >
                  <LineChart
                    data={ecgData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-ecg)" 
                      strokeWidth={2} 
                      dot={false}
                      name="ECG"
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-4">
                <Button onClick={handleGenerateReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download ECG Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notes & Observations</CardTitle>
                <CardDescription>
                  Add your medical notes for this patient's ECG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter your medical observations and notes here..."
                  className="min-h-[150px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveNotes}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            <Card className="border-none">
              <CardHeader>
                <CardTitle>ECG Analysis</CardTitle>
                <CardDescription>
                  Advanced analysis tools will be available here
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Activity className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Analysis Tool Coming Soon</h3>
                <p className="text-center text-sm text-muted-foreground max-w-md mt-2">
                  Advanced ECG analysis features will be available in a future update. 
                  These will include automated detection of anomalies, 
                  comparison with previous recordings, and diagnostic suggestions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Patient ECG History</CardTitle>
                <CardDescription>
                  View historical ECG recordings for this patient
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Historical Data Coming Soon</h3>
                <p className="text-center text-sm text-muted-foreground max-w-md mt-2">
                  The patient history view will display past ECG recordings, allowing you to
                  track changes over time and compare different sessions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorECGViewer;
