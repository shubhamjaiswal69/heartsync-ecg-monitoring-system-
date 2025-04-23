
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Eye, Download, FileText } from "lucide-react";

// Mock ECG data with different patterns for different sessions
const generateSessionData = (sessionId: number) => {
  const mockData = [];
  const baseValue = 70 + sessionId * 5;
  const patternOffset = sessionId % 3;
  
  for (let i = 0; i < 100; i++) {
    let value = baseValue;
    
    // Create different heartbeat patterns based on session
    if (i % (20 - patternOffset) === 0) value += 40 + patternOffset * 5; // R wave (peak)
    else if (i % (20 - patternOffset) === 1) value -= 30; // S wave (trough)
    else if (i % (20 - patternOffset) === 5) value += 10; // T wave
    else if (i % (20 - patternOffset) === 10) value -= 5; // Q wave
    
    // Add some randomness
    value += Math.random() * 5;
    
    mockData.push({
      time: i,
      value: value
    });
  }
  return mockData;
};

// Mock session history
const sessions = [
  {
    id: 1,
    date: "June 12, 2025",
    time: "09:30 AM",
    duration: "15 min",
    avgHeartRate: "72 BPM",
    doctorViewed: "Dr. Smith",
    notes: "Regular rhythm, no abnormalities"
  },
  {
    id: 2,
    date: "June 10, 2025",
    time: "02:15 PM",
    duration: "20 min",
    avgHeartRate: "78 BPM",
    doctorViewed: "Dr. Johnson",
    notes: "Slightly elevated heart rate"
  },
  {
    id: 3,
    date: "June 5, 2025",
    time: "10:45 AM",
    duration: "10 min",
    avgHeartRate: "75 BPM",
    doctorViewed: "Dr. Smith",
    notes: "Normal sinus rhythm"
  }
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

const PatientHistory = () => {
  const { toast } = useToast();
  
  const handleDownload = (sessionId: number) => {
    toast({
      title: "Report Downloaded",
      description: `ECG report for session #${sessionId} has been downloaded.`
    });
  };
  
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">ECG History</h1>
        <p className="text-muted-foreground">
          View and manage your past ECG recording sessions
        </p>
        
        <div className="space-y-6">
          {sessions.map((session, index) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Session #{session.id} - {session.date}</CardTitle>
                    <CardDescription>
                      {session.time} • {session.duration} • Avg: {session.avgHeartRate}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleDownload(session.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-[200px]">
                  <ChartContainer 
                    className="h-[200px]" 
                    config={chartConfig}
                  >
                    <LineChart
                      data={generateSessionData(session.id)}
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Session Details</h3>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>Duration</span>
                        <span className="font-medium text-foreground">{session.duration}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Average Heart Rate</span>
                        <span className="font-medium text-foreground">{session.avgHeartRate}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Viewed By</span>
                        <span className="font-medium text-foreground">{session.doctorViewed}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Doctor's Notes</h3>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {session.notes}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientHistory;
