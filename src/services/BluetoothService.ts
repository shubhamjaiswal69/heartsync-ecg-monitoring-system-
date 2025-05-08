
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define the device types we're interested in
export type ECGDeviceInfo = {
  id: string;
  name: string;
  rssi?: number; // Signal strength
  connected: boolean;
  deviceType: 'bluetooth' | 'wifi';
  batteryLevel?: number;
};

// Web Bluetooth service options for ECG devices
const ECG_SERVICE_UUIDS = [
  // Common heart rate service UUID
  '0000180d-0000-1000-8000-00805f9b34fb',
  // HeartSync custom service UUID (example)
  '9ecadc24-0ee5-a9e0-93f3-a3b500fffff6'
];

// Hook for managing Bluetooth device scanning and connection
export function useBluetoothService() {
  const [availableDevices, setAvailableDevices] = useState<ECGDeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ECGDeviceInfo | null>(null);
  const { toast } = useToast();

  // Check if browser supports Bluetooth API
  const isBluetoothSupported = useCallback(() => {
    return 'bluetooth' in navigator;
  }, []);

  // Start scanning for nearby devices
  const startScan = useCallback(async () => {
    if (!isBluetoothSupported()) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Bluetooth. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return [];
    }

    try {
      setIsScanning(true);
      
      // Request device with filters
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ECG_SERVICE_UUIDS },
          { namePrefix: 'ECG' },
          { namePrefix: 'HeartSync' }
        ],
        optionalServices: ['battery_service']
      });

      // When a device is found, add it to the list
      const newDevice: ECGDeviceInfo = {
        id: device.id,
        name: device.name || 'Unknown ECG Device',
        connected: device.gatt?.connected || false,
        deviceType: 'bluetooth'
      };

      // Check if device is already in the list
      setAvailableDevices(prev => {
        const exists = prev.some(d => d.id === newDevice.id);
        if (!exists) {
          return [...prev, newDevice];
        }
        return prev.map(d => d.id === newDevice.id ? newDevice : d);
      });

      return [newDevice];
    } catch (error) {
      console.error('Bluetooth scanning error:', error);
      if ((error as Error).name !== 'NotFoundError') {
        toast({
          title: "Scanning Failed",
          description: `Error finding devices: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
      return [];
    } finally {
      setIsScanning(false);
    }
  }, [isBluetoothSupported, toast]);

  // Connect to a specific device
  const connectToDevice = useCallback(async (deviceId: string): Promise<boolean> => {
    const device = availableDevices.find(d => d.id === deviceId);
    if (!device) {
      toast({
        title: "Device Not Found",
        description: "The selected device was not found. Try scanning again.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Use the Web Bluetooth API to connect to the device
      const btDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: ECG_SERVICE_UUIDS }]
      });
      
      const server = await btDevice.gatt?.connect();
      if (!server) throw new Error("Failed to connect to device");
      
      // Try to read battery service if available
      try {
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryChar = await batteryService.getCharacteristic('battery_level');
        const batteryValue = await batteryChar.readValue();
        const batteryLevel = batteryValue.getUint8(0);
        
        device.batteryLevel = batteryLevel;
      } catch (e) {
        // Battery service might not be available, ignore
        console.log('Battery service not available');
      }

      // Update device status
      const updatedDevice = {
        ...device,
        connected: true
      };
      
      setSelectedDevice(updatedDevice);
      setAvailableDevices(prev => 
        prev.map(d => d.id === deviceId ? updatedDevice : d)
      );

      toast({
        title: "Device Connected",
        description: `Successfully connected to ${device.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${device.name}: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    }
  }, [availableDevices, toast]);

  // Disconnect from the current device
  const disconnectDevice = useCallback(async (): Promise<boolean> => {
    if (!selectedDevice) return false;

    try {
      // Update our state first
      setSelectedDevice(null);
      setAvailableDevices(prev => 
        prev.map(d => d.id === selectedDevice.id ? {...d, connected: false} : d)
      );

      toast({
        title: "Device Disconnected",
        description: `Disconnected from ${selectedDevice.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Disconnection error:', error);
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect from ${selectedDevice.name}`,
        variant: "destructive", 
      });
      return false;
    }
  }, [selectedDevice, toast]);

  // Mock WiFi device discovery (for demo purposes)
  const scanForWifiDevices = useCallback(async (): Promise<ECGDeviceInfo[]> => {
    // In a real application, this would interface with a backend API
    // that uses mDNS or similar to discover devices on the local network
    
    // For demo, return mock devices
    const mockDevices: ECGDeviceInfo[] = [
      {
        id: 'wifi-ecg-001',
        name: 'HeartSync WiFi Device',
        connected: false,
        deviceType: 'wifi',
        rssi: -65
      }
    ];
    
    setAvailableDevices(prev => {
      const combined = [...prev];
      mockDevices.forEach(device => {
        if (!combined.some(d => d.id === device.id)) {
          combined.push(device);
        }
      });
      return combined;
    });
    
    return mockDevices;
  }, []);

  // Scan for all device types
  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // Run both scanning methods
      const [wifiDevices, btDevices] = await Promise.all([
        scanForWifiDevices(),
        isBluetoothSupported() ? startScan() : Promise.resolve([])
      ]);
      
      const foundDevices = [...wifiDevices, ...btDevices];
      
      if (foundDevices.length === 0) {
        toast({
          title: "No Devices Found",
          description: "No ECG devices were detected nearby. Make sure your device is turned on and in pairing mode.",
        });
      } else {
        toast({
          title: "Devices Found",
          description: `Found ${foundDevices.length} ECG device(s) nearby.`,
        });
      }
    } catch (error) {
      console.error('Device scanning error:', error);
      toast({
        title: "Scanning Failed",
        description: `Error finding devices: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [isBluetoothSupported, scanForWifiDevices, startScan, toast]);

  return {
    isBluetoothSupported,
    availableDevices,
    selectedDevice,
    isScanning,
    scanForDevices,
    connectToDevice,
    disconnectDevice
  };
}
