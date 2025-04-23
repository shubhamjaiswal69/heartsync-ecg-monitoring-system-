
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionInfoCardProps {
  isRecording: boolean;
  minHeartRate?: number;
  maxHeartRate?: number;
  avgHeartRate?: number;
}

export function SessionInfoCard({ 
  isRecording,
  minHeartRate = 68,
  maxHeartRate = 82,
  avgHeartRate = 75
}: SessionInfoCardProps) {
  return (
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
              <p className="text-lg font-medium">{minHeartRate} BPM</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Max Heart Rate</h3>
              <p className="text-lg font-medium">{maxHeartRate} BPM</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Avg Heart Rate</h3>
              <p className="text-lg font-medium">{avgHeartRate} BPM</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
