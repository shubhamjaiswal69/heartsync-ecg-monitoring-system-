
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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
      <ResponsiveContainer width="100%" height="100%">
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
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time (ms)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            label={{ value: 'Amplitude (mV)', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            formatter={(value) => [`${value} mV`, 'ECG']}
            labelFormatter={(label) => `Time: ${label} ms`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="var(--color-ecg)" 
            strokeWidth={2} 
            dot={false}
            name="ECG"
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
