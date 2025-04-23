
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

interface ECGChartProps {
  ecgData: Array<{ time: number; value: number }>;
  isLive: boolean;
  onGenerateReport: () => void;
}

const chartConfig = {
  ecg: {
    label: "ECG",
    theme: {
      light: "#9b87f5",
      dark: "#9b87f5"
    }
  }
};

export function ECGChart({ ecgData, isLive, onGenerateReport }: ECGChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ECG Waveform</CardTitle>
        <CardDescription>
          {isLive ? "Live electrocardiogram data" : "Sample electrocardiogram data"}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        <ChartContainer 
          className="h-[300px]" 
          config={chartConfig}
        >
          <LineChart
            data={ecgData}
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
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4">
        <Button onClick={onGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download ECG Data
        </Button>
      </CardFooter>
    </Card>
  );
}
