
import { useState } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock ECG data
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
    // In a real app, this would connect to the ECG device
    // For demo purposes, we'll just regenerate data every second
    const interval = setInterval(() => {
      setEcgData(generateECGData());
      setHeartRate(Math.floor(Math.random() * 20) + 65); // Random HR between 65-85
    }, 1000);
    
    // Save interval ID to clear it later
    window.sessionStorage.setItem('ecgInterval', interval.toString());
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Clear the interval
    const intervalId = window.sessionStorage.getItem('ecgInterval');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
      window.sessionStorage.removeItem('ecgInterval');
    }
  };

  const chartConfig = {
    ecg: {
      label: "ECG",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
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
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Current Heart Rate</p>
                <p className="text-3xl font-bold">{heartRate} <span className="text-base">BPM</span></p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>ECG Waveform</CardTitle>
              <CardDescription>
                Live electrocardiogram data from your device
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
            <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto flex-1">
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Share with doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                  </SelectContent>
                </Select>
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
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Info</CardTitle>
              <CardDescription>
                Information about your connected ECG device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Device</span>
                  <span className="text-sm font-medium">HeartSync ECG Monitor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Battery</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium text-green-500">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Signal Quality</span>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connection Type</span>
                  <span className="text-sm font-medium">Wi-Fi</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Device Settings</Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              Details about your current monitoring session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Session Duration</h3>
                  <p className="text-lg font-medium">{isRecording ? "00:05:23" : "00:00:00"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Min Heart Rate</h3>
                  <p className="text-lg font-medium">68 BPM</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Max Heart Rate</h3>
                  <p className="text-lg font-medium">82 BPM</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Avg Heart Rate</h3>
                  <p className="text-lg font-medium">75 BPM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientECGViewer;
