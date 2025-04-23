
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patient Activity</CardTitle>
        <CardDescription>Latest events from your connected patients</CardDescription>
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
  );
}
