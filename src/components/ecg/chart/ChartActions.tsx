
import { Button } from "@/components/ui/button";
import { FileText, Download, Save, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChartActionsProps {
  onGenerateReport: () => void;
  canExport?: boolean;
  onSaveSession?: () => void;
  onRefresh?: () => void;
}

export function ChartActions({ 
  onGenerateReport, 
  canExport = true,
  onSaveSession,
  onRefresh
}: ChartActionsProps) {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exporting report",
      description: "Your ECG report is being generated...",
    });
    
    onGenerateReport();
  };
  
  const handleSaveSession = () => {
    if (onSaveSession) {
      onSaveSession();
    } else {
      toast({
        title: "Session saved",
        description: "ECG session has been saved successfully",
      });
    }
  };
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      toast({
        title: "Refreshing data",
        description: "ECG data is being refreshed...",
      });
    }
  };

  return (
    <div className="flex justify-end p-4 pt-0 gap-2">
      {onRefresh && (
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      )}
      
      {onSaveSession && (
        <Button variant="outline" size="sm" onClick={handleSaveSession}>
          <Save className="mr-2 h-4 w-4" />
          Save Session
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={!canExport}
      >
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      
      <Button onClick={onGenerateReport} disabled={!canExport}>
        <FileText className="mr-2 h-4 w-4" />
        Generate Report
      </Button>
    </div>
  );
}
