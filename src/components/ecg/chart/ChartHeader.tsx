
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChartHeaderProps {
  isLive: boolean;
  patientName?: string;
}

export function ChartHeader({ isLive, patientName }: ChartHeaderProps) {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <CardTitle>ECG Waveform</CardTitle>
        <CardDescription>
          {isLive ? "Live electrocardiogram data" : "Sample electrocardiogram data"}
          {patientName && ` for ${patientName}`}
        </CardDescription>
      </div>
      {isLive && (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500 mt-2 md:mt-0">
          Live Recording
        </Badge>
      )}
    </CardHeader>
  );
}
