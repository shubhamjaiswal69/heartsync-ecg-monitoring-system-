
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function HistoryTab() {
  return (
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
  );
}
