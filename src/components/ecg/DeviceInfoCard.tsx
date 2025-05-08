
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocketService, DeviceConnectionStatus } from "@/services/WebSocketService";
import { useEffect, useState } from "react";

interface DeviceInfoCardProps {
  deviceId?: string;
  patientId?: string;
}

export function DeviceInfoCard({ deviceId = "ESP32-ECG-01", patientId }: DeviceInfoCardProps) {
  const [connectionStatus, setConnectionStatus] = useState<DeviceConnectionStatus>('disconnected');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { addStatusListener, addDataListener } = useWebSocketService();

  useEffect(() => {
    if (!patientId) return;
    
    const removeStatusListener = addStatusListener((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        setLastSyncTime(new Date());
      }
    });
    
    const removeDataListener = addDataListener((data) => {
      if (data.battery !== undefined) {
        setBatteryLevel(data.battery);
      }
      // Update sync time every 10 seconds to avoid excessive re-renders
      const now = new Date();
      if (!lastSyncTime || now.getTime() - lastSyncTime.getTime() > 10000) {
        setLastSyncTime(now);
      }
    });
    
    return () => {
      removeStatusListener();
      removeDataListener();
    };
  }, [patientId, addStatusListener, addDataListener, lastSyncTime]);

  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Device Info</CardTitle>
        <CardDescription>
          Current status of the ECG monitoring device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Device Name</h3>
            <p className="font-medium">HeartSync ECG Monitor</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Device ID</h3>
            <p className="font-medium">{deviceId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className={
              connectionStatus === 'connected' ? 'text-green-500 font-medium' : 
              connectionStatus === 'connecting' ? 'text-yellow-500 font-medium' : 
              'text-red-500 font-medium'
            }>
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Disconnected'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Battery</h3>
            <p className={
              batteryLevel > 20 ? 'font-medium' : 'text-red-500 font-medium'
            }>
              {Math.round(batteryLevel)}%
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Last Sync</h3>
            <p className="font-medium">{formatDate(lastSyncTime)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Firmware</h3>
            <p className="font-medium">v1.2.3</p>
          </div>
        </div>
        
        {connectionStatus === 'connected' && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            Device is actively monitoring and transmitting ECG data.
          </div>
        )}
        
        {connectionStatus === 'disconnected' && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            Device is currently offline. Connect the device to continue monitoring.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
