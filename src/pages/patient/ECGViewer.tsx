
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { HeartRateCard } from "@/components/ecg/HeartRateCard";
import { ECGChart } from "@/components/ecg/ECGChart";
import { DeviceInfoCard } from "@/components/ecg/DeviceInfoCard";
import { SessionInfoCard } from "@/components/ecg/SessionInfoCard";
import { DoctorSelector } from "@/components/ecg/DoctorSelector";
import { Button } from "@/components/ui/button";
import { DeviceConnectionStatus } from "@/components/ecg/DeviceConnectionStatus";
import { useWebSocketService } from "@/services/WebSocketService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock ECG data generator function
const generateECGData = (length = 100) => {
  const mockData = [];
  const baseValue = 80;
  for (let i = 0; i < length; i++) {
    let value = baseValue;
    
    // Create a heartbeat pattern
    if (i % 20 === 0) value += 40; // R wave (peak)
    else if (i % 20 === 1) value -= 30; // S wave (trough)
    else if (i % 20 === 5) value += 10; // T wave
    else if (i % 20 === 10) value -= 5; // Q wave
    
    // Add some randomness
    value += Math.random() * 5;
    
    mockData.push({
      time: i,
      value: value
    });
  }
  return mockData;
};

const PatientECGViewer = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [ecgData, setEcgData] = useState(generateECGData());
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [heartRate, setHeartRate] = useState(75);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveSessionDialogOpen, setIsSaveSessionDialogOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  
  const { toast } = useToast();
  const { addDataListener } = useWebSocketService();

  // Get the current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setPatientId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Set up data listener for heart rate updates
  useEffect(() => {
    const removeDataListener = addDataListener((data) => {
      if (data.heartRate) {
        setHeartRate(data.heartRate);
      }
      
      // Add ECG data point
      setEcgData(prevData => {
        const newData = [...prevData, { time: data.timestamp, value: data.value }];
        if (newData.length > 200) {
          return newData.slice(newData.length - 200);
        }
        return newData;
      });
    });
    
    return () => {
      removeDataListener();
    };
  }, [addDataListener]);

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "ECG recording has started. Data is being captured.",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "ECG recording has been stopped.",
    });
  };
  
  const handleSaveSession = () => {
    setIsSaveSessionDialogOpen(true);
  };
  
  const handleSaveSessionConfirm = async () => {
    if (!sessionTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for this ECG session",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Save ECG recording to Supabase
      const { error } = await supabase
        .from('ecg_recordings')
        .insert({
          patient_id: patientId,
          title: sessionTitle,
          description: sessionNotes,
          ecg_data: JSON.stringify(ecgData),
          duration: ecgData.length > 0 ? ecgData[ecgData.length - 1].time - ecgData[0].time : 0,
          heart_rate: heartRate
        });
      
      if (error) throw error;
      
      toast({
        title: "Session Saved",
        description: "Your ECG session has been saved successfully.",
      });
      
      // Reset form fields
      setSessionTitle("");
      setSessionNotes("");
      setIsSaveSessionDialogOpen(false);
    } catch (error) {
      console.error("Error saving ECG session:", error);
      toast({
        title: "Error",
        description: "Failed to save ECG session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Your ECG report is being generated and will be available for download shortly.",
    });
    
    // This would normally trigger a server-side process to generate a PDF
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your ECG report has been generated and is ready for download.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Live ECG Monitor</h1>
            <p className="text-muted-foreground">
              View your real-time ECG data and share with your doctor
            </p>
          </div>
          <HeartRateCard heartRate={heartRate} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <ECGChart 
              ecgData={ecgData}
              isLive={isRecording}
              onGenerateReport={handleGenerateReport}
              patientId={patientId || undefined}
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto flex-1">
                <DoctorSelector 
                  selectedDoctor={selectedDoctor}
                  onDoctorChange={setSelectedDoctor}
                />
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                {!isRecording ? (
                  <Button className="flex-1" onClick={handleStartRecording}>
                    Start Recording
                  </Button>
                ) : (
                  <Button className="flex-1" variant="destructive" onClick={handleStopRecording}>
                    Stop Recording
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  disabled={!isRecording && ecgData.length === 0}
                  onClick={handleSaveSession}
                >
                  Save Session
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {patientId && <DeviceConnectionStatus patientId={patientId} />}
            <DeviceInfoCard patientId={patientId || undefined} />
          </div>
        </div>

        <SessionInfoCard 
          isRecording={isRecording} 
          minHeartRate={heartRate - 5}
          maxHeartRate={heartRate + 5}
          avgHeartRate={heartRate}
        />
        
        <Dialog open={isSaveSessionDialogOpen} onOpenChange={setIsSaveSessionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save ECG Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="session-title">Session Title</Label>
                <Input
                  id="session-title"
                  placeholder="Enter a title for this session"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-notes">Notes (Optional)</Label>
                <Textarea
                  id="session-notes"
                  placeholder="Add any notes or observations about this ECG session"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSaveSessionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSessionConfirm} disabled={!sessionTitle.trim() || isLoading}>
                {isLoading ? "Saving..." : "Save Session"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PatientECGViewer;
