
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const patientActivityData = [
  { name: "Mon", sessions: 4 },
  { name: "Tue", sessions: 3 },
  { name: "Wed", sessions: 5 },
  { name: "Thu", sessions: 2 },
  { name: "Fri", sessions: 6 },
  { name: "Sat", sessions: 2 },
  { name: "Sun", sessions: 1 }
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

export function PatientActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Activity</CardTitle>
        <CardDescription>ECG recording sessions over the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer className="h-[300px]" config={chartConfig}>
            <BarChart
              data={patientActivityData}
              margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
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
  );
}
