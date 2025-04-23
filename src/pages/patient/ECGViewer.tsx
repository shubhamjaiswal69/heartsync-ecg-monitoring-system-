import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { HeartRateCard } from "@/components/ecg/HeartRateCard";
import { ECGChart } from "@/components/ecg/ECGChart";
import { DeviceInfoCard } from "@/components/ecg/DeviceInfoCard";
import { SessionInfoCard } from "@/components/ecg/SessionInfoCard";
import { DoctorSelector } from "@/components/ecg/DoctorSelector";
import { Button } from "@/components/ui/button";

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

  const handleStartRecording = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setEcgData(generateECGData());
      setHeartRate(Math.floor(Math.random() * 20) + 65);
    }, 1000);
    window.sessionStorage.setItem('ecgInterval', interval.toString());
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const intervalId = window.sessionStorage.getItem('ecgInterval');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
      window.sessionStorage.removeItem('ecgInterval');
    }
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
              onGenerateReport={() => {}}
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
                <Button variant="outline" className="flex-1" disabled={!isRecording}>
                  Save Session
                </Button>
              </div>
            </div>
          </div>

          <DeviceInfoCard />
        </div>

        <SessionInfoCard isRecording={isRecording} />
      </div>
    </DashboardLayout>
  );
};

export default PatientECGViewer;
