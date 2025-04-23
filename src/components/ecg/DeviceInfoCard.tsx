
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DeviceInfoCard() {
  return (
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
  );
}
