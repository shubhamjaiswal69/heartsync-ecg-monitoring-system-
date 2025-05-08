
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type DeviceConnectionStatus = 'connected' | 'disconnected' | 'connecting';
export type DeviceData = {
  deviceId: string;
  timestamp: number;
  value: number;
  heartRate?: number;
  battery?: number;
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private deviceId: string | null = null;
  private patientId: string | null = null;
  private statusListeners: ((status: DeviceConnectionStatus) => void)[] = [];
  private dataListeners: ((data: DeviceData) => void)[] = [];
  private lastHeartRate: number | null = null;
  private sessionId: string | null = null;

  constructor() {
    // Initialize but don't connect until explicitly requested
  }
  
  public connect(deviceId: string, patientId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }
    
    this.deviceId = deviceId;
    this.patientId = patientId;
    
    try {
      this.notifyStatusListeners('connecting');
      
      // In a real implementation, this would connect to your ESP32 device or a proxy server
      // For demo purposes, we're using a mock WebSocket connection
      this.socket = new WebSocket(`wss://echo.websocket.org`);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.notifyStatusListeners('disconnected');
      this.scheduleReconnect();
    }
  }
  
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.deviceId = null;
    this.patientId = null;
    this.notifyStatusListeners('disconnected');
    this.endSession();
  }
  
  public addStatusListener(listener: (status: DeviceConnectionStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }
  
  public addDataListener(listener: (data: DeviceData) => void): () => void {
    this.dataListeners.push(listener);
    return () => {
      this.dataListeners = this.dataListeners.filter(l => l !== listener);
    };
  }
  
  public sendCommand(command: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ command, deviceId: this.deviceId }));
    } else {
      console.error("WebSocket not connected");
    }
  }
  
  private async startSession(): Promise<void> {
    if (!this.patientId || !this.deviceId) return;
    
    try {
      const { data, error } = await supabase
        .from('ecg_live_sessions')
        .insert({
          patient_id: this.patientId,
          device_id: this.deviceId,
          status: 'active',
          current_heart_rate: this.lastHeartRate || 75
        })
        .select()
        .single();
      
      if (error) throw error;
      
      this.sessionId = data.id;
      console.log("ECG session started:", this.sessionId);
    } catch (error) {
      console.error("Failed to start ECG session:", error);
    }
  }
  
  private async updateSession(heartRate: number): Promise<void> {
    if (!this.sessionId) return;
    
    try {
      const { error } = await supabase
        .from('ecg_live_sessions')
        .update({
          current_heart_rate: heartRate,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.sessionId);
      
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update ECG session:", error);
    }
  }
  
  private async endSession(): Promise<void> {
    if (!this.sessionId) return;
    
    try {
      const { error } = await supabase
        .from('ecg_live_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', this.sessionId);
      
      if (error) throw error;
      
      this.sessionId = null;
      console.log("ECG session ended");
    } catch (error) {
      console.error("Failed to end ECG session:", error);
    }
  }
  
  private handleOpen(): void {
    console.log("WebSocket connected");
    this.notifyStatusListeners('connected');
    this.startSession();
    
    // Start sending mock ECG data
    this.startMockDataStream();
  }
  
  private handleMessage(event: MessageEvent): void {
    try {
      // In a real implementation, this would parse data from your ESP32 device
      const data = JSON.parse(event.data);
      this.notifyDataListeners(data);
      
      // Update heart rate in the session if available
      if (data.heartRate && data.heartRate !== this.lastHeartRate) {
        this.lastHeartRate = data.heartRate;
        this.updateSession(data.heartRate);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  }
  
  private handleClose(): void {
    console.log("WebSocket disconnected");
    this.socket = null;
    this.notifyStatusListeners('disconnected');
    this.scheduleReconnect();
    this.endSession();
  }
  
  private handleError(event: Event): void {
    console.error("WebSocket error:", event);
    this.notifyStatusListeners('disconnected');
    this.scheduleReconnect();
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectTimer = window.setTimeout(() => {
      if (this.deviceId && this.patientId) {
        console.log("Attempting to reconnect WebSocket...");
        this.connect(this.deviceId, this.patientId);
      }
    }, 5000);
  }
  
  private notifyStatusListeners(status: DeviceConnectionStatus): void {
    this.statusListeners.forEach(listener => listener(status));
  }
  
  private notifyDataListeners(data: DeviceData): void {
    this.dataListeners.forEach(listener => listener(data));
  }
  
  // For demo purposes only - generates mock ECG data
  private startMockDataStream(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    
    let time = 0;
    const baseHeartRate = 75 + Math.floor(Math.random() * 10);
    this.lastHeartRate = baseHeartRate;
    
    const intervalId = setInterval(() => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        clearInterval(intervalId);
        return;
      }
      
      // Generate a realistic ECG-like waveform
      let value = 0;
      const mod = time % 20;
      
      if (mod === 0) value = 80 + Math.random() * 40; // R wave (peak)
      else if (mod === 1) value = 30 - Math.random() * 30; // S wave (trough)
      else if (mod === 5) value = 60 + Math.random() * 10; // T wave
      else if (mod === 10) value = 50 - Math.random() * 5; // Q wave
      else value = 50 + Math.random() * 5; // Baseline
      
      // Occasionally change heart rate
      if (time % 100 === 0) {
        this.lastHeartRate = Math.max(60, Math.min(100, baseHeartRate + Math.floor(Math.random() * 10) - 5));
      }
      
      const mockData: DeviceData = {
        deviceId: this.deviceId || 'mock-device',
        timestamp: Date.now(),
        value,
        heartRate: this.lastHeartRate,
        battery: 85 - (time % 100) / 10
      };
      
      // Send the mock data back through the handleMessage method
      this.handleMessage(new MessageEvent('message', {
        data: JSON.stringify(mockData)
      }));
      
      time++;
    }, 50); // 20 samples per second
    
    // Store the interval ID to clear it when disconnecting
    (this as any).mockDataInterval = intervalId;
  }
}

// Export a singleton instance
export const webSocketService = new WebSocketService();

// React hook for using the WebSocket service
export function useWebSocketService() {
  const { toast } = useToast();
  
  const connectToDevice = (deviceId: string, patientId: string) => {
    webSocketService.connect(deviceId, patientId);
    toast({
      title: "Connecting to device",
      description: `Attempting to connect to device ${deviceId}`,
    });
  };
  
  const disconnectFromDevice = () => {
    webSocketService.disconnect();
    toast({
      title: "Disconnected from device",
      description: "Device connection closed",
    });
  };
  
  return {
    connectToDevice,
    disconnectFromDevice,
    addStatusListener: webSocketService.addStatusListener.bind(webSocketService),
    addDataListener: webSocketService.addDataListener.bind(webSocketService),
    sendCommand: webSocketService.sendCommand.bind(webSocketService),
  };
}
