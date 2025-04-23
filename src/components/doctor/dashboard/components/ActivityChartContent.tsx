
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ActivityChartContentProps {
  data: Array<{ name: string; sessions: number }>;
  chartOptions: {
    margin: { top: number; right: number; left: number; bottom: number };
    barProps: {
      dataKey: string;
      fill: string;
      name: string;
      radius: [number, number, number, number];
    };
    gridProps: {
      strokeDasharray: string;
      stroke: string;
      opacity: number;
    };
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export function ActivityChartContent({ data, chartOptions, dimensions }: ActivityChartContentProps) {
  const { margin, barProps, gridProps } = chartOptions;

  return (
    <ResponsiveContainer width="100%" height={dimensions.height}>
      <BarChart
        data={data}
        margin={margin}
      >
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar {...barProps} />
      </BarChart>
    </ResponsiveContainer>
  );
}
