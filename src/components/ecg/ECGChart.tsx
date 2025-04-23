
import { Card, CardContent } from "@/components/ui/card";
import { ChartHeader } from "./chart/ChartHeader";
import { LineChartComponent } from "./chart/LineChartComponent";
import { ChartActions } from "./chart/ChartActions";

interface ECGChartProps {
  ecgData: Array<{ time: number; value: number }>;
  isLive: boolean;
  onGenerateReport: () => void;
}

export function ECGChart({ ecgData, isLive, onGenerateReport }: ECGChartProps) {
  return (
    <Card>
      <ChartHeader isLive={isLive} />
      <CardContent className="min-h-[300px]">
        <LineChartComponent ecgData={ecgData} />
      </CardContent>
      <ChartActions onGenerateReport={onGenerateReport} />
    </Card>
  );
}
