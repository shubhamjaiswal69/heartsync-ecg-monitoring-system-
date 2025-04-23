
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

interface ChartActionsProps {
  onGenerateReport: () => void;
}

export function ChartActions({ onGenerateReport }: ChartActionsProps) {
  return (
    <CardFooter className="flex flex-wrap gap-4">
      <Button onClick={onGenerateReport}>
        <FileText className="mr-2 h-4 w-4" />
        Generate Report
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download ECG Data
      </Button>
    </CardFooter>
  );
}
