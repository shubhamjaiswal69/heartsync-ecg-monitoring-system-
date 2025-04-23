
import { useMemo } from 'react';

interface ChartDataPoint {
  name: string;
  sessions: number;
}

interface ChartConfig {
  sessions: {
    label: string;
    theme: {
      light: string;
      dark: string;
    }
  }
}

export const useActivityChart = (data: ChartDataPoint[], config: ChartConfig) => {
  const chartOptions = useMemo(() => ({
    margin: { top: 5, right: 10, left: 10, bottom: 20 },
    barProps: {
      dataKey: "sessions",
      fill: "var(--color-sessions)",
      name: "Sessions",
      radius: [4, 4, 0, 0] as [number, number, number, number]
    },
    gridProps: {
      strokeDasharray: "3 3",
      stroke: "#333",
      opacity: 0.1
    }
  }), []);

  return {
    data,
    config,
    chartOptions
  };
};
