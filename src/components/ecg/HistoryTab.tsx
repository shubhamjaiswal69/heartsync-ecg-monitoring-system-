
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ECGRecording {
  id: string;
  title: string;
  description: string | null;
  heart_rate: number | null;
  duration: number;
  recorded_at: string;
}

interface HistoryTabProps {
  patientId?: string;
}

export function HistoryTab({ patientId }: HistoryTabProps) {
  const [recordings, setRecordings] = useState<ECGRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!patientId) {
        setRecordings([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('ecg_recordings')
          .select('*')
          .eq('patient_id', patientId)
          .order('recorded_at', { ascending: false });
        
        if (error) throw error;
        
        setRecordings(data as ECGRecording[]);
      } catch (error) {
        console.error("Error fetching ECG recordings:", error);
        toast({
          title: "Error",
          description: "Failed to load ECG history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecordings();
  }, [patientId, toast]);
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleViewRecording = (id: string) => {
    toast({
      title: "Loading Recording",
      description: "Opening ECG recording for detailed view",
    });
    
    // This would normally navigate to a detailed view of the recording
  };
  
  const handleExportPDF = (id: string, title: string) => {
    toast({
      title: "Exporting Recording",
      description: `Generating PDF for "${title}"`,
    });
    
    // This would normally trigger a PDF generation process
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ECG History</CardTitle>
          <CardDescription>View past ECG recordings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recordings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ECG History</CardTitle>
          <CardDescription>View past ECG recordings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 border rounded-md">
            <p className="text-muted-foreground">No ECG recordings found for this patient.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ECG History</CardTitle>
        <CardDescription>View past ECG recordings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg">{recording.title}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>{new Date(recording.recorded_at).toLocaleString()}</span>
                    </div>
                    
                    {recording.heart_rate && (
                      <div className="flex items-center">
                        <Heart className="h-3.5 w-3.5 mr-1" />
                        <span>{recording.heart_rate} BPM</span>
                      </div>
                    )}
                    
                    <div>Duration: {formatDuration(recording.duration / 1000)}</div>
                  </div>
                  
                  {recording.description && (
                    <p className="mt-2 text-sm">{recording.description}</p>
                  )}
                </div>
                
                <div className="flex flex-row md:flex-col lg:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewRecording(recording.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportPDF(recording.id, recording.title)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
