
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Activity, Users, FileText, Bell } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock patient activity data
const patientActivityData = [
  { name: "Mon", sessions: 4 },
  { name: "Tue", sessions: 3 },
  { name: "Wed", sessions: 5 },
  { name: "Thu", sessions: 2 },
  { name: "Fri", sessions: 6 },
  { name: "Sat", sessions: 2 },
  { name: "Sun", sessions: 1 }
];

// Mock alerts data
const alerts = [
  {
    id: 1,
    patient: "John Doe",
    type: "Irregular Heartbeat",
    time: "Today, 10:30 AM",
    severity: "high"
  },
  {
    id: 2,
    patient: "Sarah Johnson",
    type: "Elevated Heart Rate",
    time: "Yesterday, 3:45 PM",
    severity: "medium"
  },
  {
    id: 3,
    patient: "Michael Smith",
    type: "Missed Recording",
    time: "June 10, 9:15 AM",
    severity: "low"
  }
];

const chartConfig = {
  sessions: {
    label: "Sessions",
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5"
    }
  }
};

const DoctorDashboard = () => {
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, Dr. Smith</h1>
        <p className="text-muted-foreground">
          Monitor your patients' heart health and manage ECG data
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                3 new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitoring</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Patients currently being monitored
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ECG Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Last 7 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Activity</CardTitle>
              <CardDescription>
                ECG recording sessions over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer 
                  className="h-[300px]" 
                  config={chartConfig}
                >
                  <BarChart
                    data={patientActivityData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="sessions" 
                      fill="var(--color-sessions)" 
                      name="Sessions"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Patient Alerts</CardTitle>
                <CardDescription>
                  Recent alerts from your patients
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex gap-4">
                    <div className={`mt-0.5 rounded-full p-1
                      ${alert.severity === 'high' ? 'bg-destructive/20 text-destructive' : 
                        alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                        'bg-blue-500/20 text-blue-500'}`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.patient}</p>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Activity</CardTitle>
            <CardDescription>
              Latest events from your connected patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe uploaded a new ECG recording</p>
                  <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Johnson accepted your connection</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 2:45 PM</p>
                </div>
                <Button variant="outline" size="sm">View Profile</Button>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Michael Smith missed scheduled recording</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 9:15 AM</p>
                </div>
                <Button variant="outline" size="sm">Send Reminder</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
