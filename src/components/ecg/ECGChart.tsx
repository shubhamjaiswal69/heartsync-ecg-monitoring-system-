
import { Card, CardContent } from "@/components/ui/card";
import { ChartHeader } from "./chart/ChartHeader";
import { LineChartComponent } from "./chart/LineChartComponent";
import { ChartActions } from "./chart/ChartActions";
import { Spinner } from "@/components/ui/spinner";

interface ECGChartProps {
  ecgData: Array<{ time: number; value: number }>;
  isLive: boolean;
  onGenerateReport: () => void;
  patientName?: string;
  isLoading?: boolean;
}

export function ECGChart({ 
  ecgData, 
  isLive, 
  onGenerateReport, 
  patientName,
  isLoading = false 
}: ECGChartProps) {
  return (
    <Card>
      <ChartHeader isLive={isLive} patientName={patientName} />
      <CardContent className="min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <LineChartComponent ecgData={ecgData} />
        )}
      </CardContent>
      <ChartActions onGenerateReport={onGenerateReport} />
    </Card>
  );
}
