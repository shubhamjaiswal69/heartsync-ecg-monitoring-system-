
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ActivityBarChartProps {
  data: Array<{ name: string; sessions: number }>;
  config: {
    sessions: {
      label: string;
      theme: {
        light: string;
        dark: string;
      }
    }
  };
}

export function ActivityBarChart({ data, config }: ActivityBarChartProps) {
  return (
    <ChartContainer className="h-[300px]" config={config}>
      <BarChart
        data={data}
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
  );
}
