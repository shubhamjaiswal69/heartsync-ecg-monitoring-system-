
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartHeaderProps {
  isLive: boolean;
}

export function ChartHeader({ isLive }: ChartHeaderProps) {
  return (
    <CardHeader>
      <CardTitle>ECG Waveform</CardTitle>
      <CardDescription>
        {isLive ? "Live electrocardiogram data" : "Sample electrocardiogram data"}
      </CardDescription>
    </CardHeader>
  );
}
