
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AnalysisTab() {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>ECG Analysis</CardTitle>
        <CardDescription>
          Advanced analysis tools will be available here
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Activity className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Analysis Tool Coming Soon</h3>
        <p className="text-center text-sm text-muted-foreground max-w-md mt-2">
          Advanced ECG analysis features will be available in a future update. 
          These will include automated detection of anomalies, 
          comparison with previous recordings, and diagnostic suggestions.
        </p>
      </CardContent>
    </Card>
  );
}
