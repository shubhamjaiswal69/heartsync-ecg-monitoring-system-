
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HeartRateCardProps {
  heartRate: number;
}

export function HeartRateCard({ heartRate }: HeartRateCardProps) {
  return (
    <Card className="w-full md:w-auto">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Heart Rate</p>
          <p className="text-3xl font-bold">{heartRate} <span className="text-base">BPM</span></p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Activity className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
