
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface LineChartComponentProps {
  ecgData: Array<{ time: number; value: number }>;
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

export function LineChartComponent({ ecgData }: LineChartComponentProps) {
  return (
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
  );
}
