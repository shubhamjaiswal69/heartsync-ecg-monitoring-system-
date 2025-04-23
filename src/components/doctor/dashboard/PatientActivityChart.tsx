
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityBarChart } from "./components/ActivityBarChart";
import { patientActivityData } from "./constants/activityData";
import { activityChartConfig } from "./config/chartConfig";

export function PatientActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Activity</CardTitle>
        <CardDescription>ECG recording sessions over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ActivityBarChart 
            data={patientActivityData} 
            config={activityChartConfig}
          />
        </div>
      </CardContent>
    </Card>
  );
}
