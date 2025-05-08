import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartHeader } from "./chart/ChartHeader";
import { LineChartComponent } from "./chart/LineChartComponent";
import { ChartActions } from "./chart/ChartActions";
import { Spinner } from "@/components/ui/spinner";
import { useWebSocketService } from "@/services/WebSocketService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

interface ECGChartProps {
  ecgData: Array<{ time: number; value: number }>;
  isLive: boolean;
  onGenerateReport: () => void;
  patientName?: string;
  isLoading?: boolean;
  patientId?: string;
}

export function ECGChart({ 
  ecgData: initialEcgData, 
  isLive, 
  onGenerateReport, 
  patientName,
  isLoading = false,
  patientId
}: ECGChartProps) {
  const [ecgData, setEcgData] = useState(initialEcgData);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const { addStatusListener, addDataListener } = useWebSocketService();
  
  // Handle initial data
  useEffect(() => {
    if (!isLive) {
      setEcgData(initialEcgData);
    }
  }, [initialEcgData, isLive]);
  
  // Set up WebSocket listeners for live data
  useEffect(() => {
    if (!isLive || !patientId) return;
    
    const removeStatusListener = addStatusListener((status) => {
      setConnectionStatus(status);
    });
    
    const removeDataListener = addDataListener((data) => {
      setEcgData(prevData => {
        // Keep only the last 200 data points for performance
        const newData = [...prevData, { time: data.timestamp, value: data.value }];
        if (newData.length > 200) {
          return newData.slice(newData.length - 200);
        }
        return newData;
      });
    });
    
    return () => {
      removeStatusListener();
      removeDataListener();
    };
  }, [isLive, patientId, addStatusListener, addDataListener]);
  
  return (
    <Card>
      <ChartHeader isLive={isLive} patientName={patientName} />
      <CardContent className="min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : isLive && connectionStatus !== 'connected' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
            <Alert variant="destructive" className="max-w-md">
              <AlertDescription>
                {connectionStatus === 'connecting' 
                  ? "Connecting to ECG device... Please wait." 
                  : "Device not connected. Connect your ECG device to view live data."}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <LineChartComponent ecgData={ecgData} />
        )}
      </CardContent>
      <ChartActions 
        onGenerateReport={onGenerateReport} 
        canExport={ecgData.length > 0 && !isLoading}
      />
    </Card>
  );
}
