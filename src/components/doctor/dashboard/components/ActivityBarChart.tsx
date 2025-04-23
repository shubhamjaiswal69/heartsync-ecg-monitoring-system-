
import { ChartContainer } from "@/components/ui/chart";
import { useActivityChart } from "../hooks/useActivityChart";
import { useChartDimensions } from "../hooks/useChartDimensions";
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
  const dimensions = useChartDimensions();

  return (
    <div className="chart-container">
      <ChartContainer className="h-[300px]" config={config}>
        <ActivityChartContent 
          data={chartData.data}
          chartOptions={chartData.chartOptions}
          dimensions={dimensions}
        />
      </ChartContainer>
    </div>
  );
}
