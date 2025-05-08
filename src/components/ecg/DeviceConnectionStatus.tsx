import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Battery, Wifi, WifiOff } from "lucide-react";
import { type DeviceConnectionStatus as DeviceConnectionStatusType, useWebSocketService } from "@/services/WebSocketService";
import { useToast } from "@/hooks/use-toast";

interface DeviceStatusProps {
  patientId: string;
  deviceId?: string;
}

export function DeviceConnectionStatus({ patientId, deviceId = "ESP32-ECG-01" }: DeviceStatusProps) {
  const [connectionStatus, setConnectionStatus] = useState<DeviceConnectionStatusType>('disconnected');
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const { connectToDevice, disconnectFromDevice, addStatusListener, addDataListener } = useWebSocketService();
  const { toast } = useToast();

  useEffect(() => {
    const removeStatusListener = addStatusListener((status) => {
      setConnectionStatus(status);
      
      if (status === 'connected') {
        toast({
          title: "Device Connected",
          description: `Successfully connected to device ${deviceId}`,
        });
      } else if (status === 'disconnected') {
        toast({
          title: "Device Disconnected",
          description: "Connection to device lost",
          variant: "destructive",
        });
      }
    });
    
    const removeDataListener = addDataListener((data) => {
      if (data.battery !== undefined) {
        setBatteryLevel(data.battery);
      }
    });
    
    return () => {
      removeStatusListener();
      removeDataListener();
      disconnectFromDevice();
    };
  }, [patientId, deviceId, addStatusListener, addDataListener, disconnectFromDevice, toast]);

  const handleConnect = () => {
    connectToDevice(deviceId, patientId);
  };

  const handleDisconnect = () => {
    disconnectFromDevice();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Device Status</CardTitle>
            <CardDescription>Connection to wearable ECG device</CardDescription>
          </div>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : connectionStatus === 'connecting' ? (
                <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium">Device ID: {deviceId}</span>
            </div>
            <Badge 
              variant={
                connectionStatus === 'connected' ? "default" : 
                connectionStatus === 'connecting' ? "outline" : 
                "destructive"
              }
              className={
                connectionStatus === 'connected' ? "bg-green-500" : 
                connectionStatus === 'connecting' ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : 
                ""
              }
            >
              {connectionStatus === 'connected' ? "Connected" : 
               connectionStatus === 'connecting' ? "Connecting..." : 
               "Disconnected"}
            </Badge>
          </div>
          
          {connectionStatus === 'connected' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-primary" />
                  <span>Battery Level</span>
                </div>
                <span className="font-medium">{Math.round(batteryLevel)}%</span>
              </div>
              <Progress value={batteryLevel} className="h-2" />
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-2">
            {connectionStatus !== 'connected' ? (
              <Button 
                onClick={handleConnect} 
                size="sm"
                disabled={connectionStatus === 'connecting'}
              >
                Connect Device
              </Button>
            ) : (
              <Button 
                onClick={handleDisconnect} 
                size="sm" 
                variant="outline"
              >
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
