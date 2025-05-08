
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Smartphone, Bluetooth, Wifi, Signal, ChevronsUpDown } from "lucide-react";
import { ECGDeviceInfo, useBluetoothService } from "@/services/BluetoothService";
import { useWebSocketService } from "@/services/WebSocketService";

interface DeviceDiscoveryProps {
  patientId: string;
  onDeviceSelected?: (deviceId: string) => void;
}

export function DeviceDiscovery({ patientId, onDeviceSelected }: DeviceDiscoveryProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { connectToDevice } = useWebSocketService();
  
  const {
    availableDevices,
    isScanning,
    scanForDevices,
    connectToDevice: connectToBtDevice,
    isBluetoothSupported
  } = useBluetoothService();
  
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };
  
  const handleScan = () => {
    scanForDevices();
  };
  
  const handleConnect = async () => {
    if (!selectedDeviceId) return;
    
    const device = availableDevices.find(d => d.id === selectedDeviceId);
    if (!device) return;
    
    if (device.deviceType === 'bluetooth') {
      // Connect via Bluetooth
      const success = await connectToBtDevice(selectedDeviceId);
      if (success && onDeviceSelected) {
        onDeviceSelected(selectedDeviceId);
      }
    } else {
      // Connect via WebSocket for WiFi devices
      connectToDevice(selectedDeviceId, patientId);
      if (onDeviceSelected) {
        onDeviceSelected(selectedDeviceId);
      }
    }
  };
  
  const getSignalStrengthIcon = (rssi?: number) => {
    if (rssi === undefined) return <Signal className="h-4 w-4 text-muted-foreground" />;
    
    if (rssi > -60) return <Signal className="h-4 w-4 text-green-500" />;
    if (rssi > -70) return <Signal className="h-4 w-4 text-yellow-500" />;
    return <Signal className="h-4 w-4 text-red-500" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Discover ECG Devices</CardTitle>
        <CardDescription>
          Find and connect to HeartSync devices nearby
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {!isBluetoothSupported() && (
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 mb-4">
              <p>Bluetooth is not supported in your browser. WiFi devices will still be detected.</p>
            </div>
          )}
          
          {availableDevices.length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No devices found. Start a scan to discover devices.</p>
            </div>
          ) : (
            <RadioGroup value={selectedDeviceId || ""} onValueChange={handleDeviceSelect}>
              <div className="space-y-2">
                {availableDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`flex items-center space-x-2 border rounded-md p-3 ${
                      selectedDeviceId === device.id ? "border-primary bg-primary/5" : "border-muted"
                    }`}
                  >
                    <RadioGroupItem value={device.id} id={device.id} />
                    <Label htmlFor={device.id} className="flex-1 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center space-x-2">
                        {device.deviceType === 'bluetooth' ? (
                          <Bluetooth className="h-4 w-4 text-primary" />
                        ) : (
                          <Wifi className="h-4 w-4 text-primary" />
                        )}
                        <span>{device.name}</span>
                      </div>
                      <div className="flex items-center">
                        {getSignalStrengthIcon(device.rssi)}
                        <span className="text-xs text-muted-foreground ml-1">
                          {device.connected ? "Connected" : "Available"}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
          
          {isScanning && (
            <div className="flex justify-center items-center py-2">
              <Spinner className="h-4 w-4 mr-2" />
              <span className="text-sm text-muted-foreground">Scanning for devices...</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Scanning...
            </>
          ) : (
            <>
              <ChevronsUpDown className="h-4 w-4 mr-2" />
              Scan for Devices
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleConnect}
          disabled={!selectedDeviceId || isScanning}
        >
          Connect to Device
        </Button>
      </CardFooter>
    </Card>
  );
}
