
import { ChartContainer } from "@/components/ui/chart";
import { useActivityChart } from "../hooks/useActivityChart";
import { ActivityChartContent } from "./ActivityChartContent";

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
  const chartData = useActivityChart(data, config);

  return (
    <ChartContainer className="h-[300px]" config={config}>
      <ActivityChartContent 
        data={chartData.data}
        chartOptions={chartData.chartOptions}
      />
    </ChartContainer>
  );
}
