
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export function AlertsList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Patient Alerts</CardTitle>
          <CardDescription>Recent alerts from your patients</CardDescription>
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
  );
}
