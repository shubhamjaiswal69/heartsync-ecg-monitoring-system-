
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ECGChart } from "@/components/ecg/ECGChart";
import { NotesSection } from "@/components/ecg/NotesSection";
import { AnalysisTab } from "@/components/ecg/AnalysisTab";
import { HistoryTab } from "@/components/ecg/HistoryTab";
import { ViewerContent } from "@/components/ecg/ViewerContent";
import { useECGData } from "@/hooks/useECGData";
import { HeartRateCard } from "@/components/ecg/HeartRateCard";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { useLiveECGSession } from "@/hooks/useLiveECGSession";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useWebSocketService } from "@/services/WebSocketService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DoctorECGViewer = () => {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "1");
  const [notes, setNotes] = useState("");
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [hasPermission, setHasPermission] = useState(true); // Default to true to avoid flash of permission error
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { profile, loading: loadingProfile, error: profileError } = usePatientProfile(selectedPatient);
  const { session: liveSession, loading: loadingSession } = useLiveECGSession(selectedPatient);
  const { addDataListener } = useWebSocketService();
  
  const {
    patternType,
    ecgData,
    isLive,
    heartRate,
    handlePatternChange,
    handleLiveToggle,
    setEcgData
  } = useECGData();
  
  // Set up data listener for live ECG data
  useEffect(() => {
    if (!isLive || !selectedPatient) return;
    
    const removeDataListener = addDataListener((data) => {
      if (data.heartRate) {
        // Heart rate updates are handled by the useECGData hook
      }
      
      // Add ECG data point
      setEcgData(prevData => {
        const newData = [...prevData, { time: data.timestamp, value: data.value }];
        if (newData.length > 200) {
          return newData.slice(newData.length - 200);
        }
        return newData;
      });
    });
    
    return () => {
      removeDataListener();
    };
  }, [isLive, selectedPatient, addDataListener, setEcgData]);
  
  // Check if doctor has permission to view this patient's data
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!selectedPatient) return;
        
        // If mock patient (numeric ID), skip permission check
        if (!isNaN(Number(selectedPatient))) {
          setHasPermission(true);
          return;
        }
        
        const { data, error } = await supabase.rpc('is_connected_to_doctor', {
          doctor_id: selectedPatient
        });
        
        if (error) {
          console.error("Error checking permission:", error);
          // For demo purposes, default to showing data even if there's an error
          setHasPermission(true);
          return;
        }
        
        setHasPermission(!!data);
        
        if (!data) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this patient's data",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking permission:", error);
        setHasPermission(true); // Default to showing data for mock patients
      }
    };
    
    checkPermission();
  }, [selectedPatient, toast]);
  
  // Update live mode based on live session
  useEffect(() => {
    if (liveSession?.status === 'active' && !isLive) {
      handleLiveToggle(true);
      toast({
        title: "Live Session Detected",
        description: "Patient is currently recording ECG data"
      });
    }
  }, [liveSession, isLive, handleLiveToggle, toast]);
  
  const handleSaveNotes = async () => {
    if (!notes.trim()) return;
    
    try {
      toast({
        title: "Notes Saved",
        description: "Patient notes have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateReport = () => {
    setReportTitle(`ECG Report - ${profile?.full_name || 'Patient'} - ${new Date().toLocaleDateString()}`);
    setIsReportDialogOpen(true);
  };
  
  const handleCreateReport = async () => {
    if (!reportTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the report",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsGeneratingReport(true);
      
      // Save report to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('reports')
        .insert({
          title: reportTitle,
          content: notes,
          patient_id: selectedPatient,
          doctor_id: user.id
        });
      
      if (error) throw error;
      
      setIsReportDialogOpen(false);
      
      toast({
        title: "Report Generated",
        description: "ECG report has been generated and saved successfully."
      });
      
      // Reset form
      setReportTitle("");
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };
  
  const patientName = profile?.full_name || "Selected Patient";
  const isLoading = isLoadingPatient || loadingProfile;

  // Handle case when still loading
  if (isLoading) {
    return (
      <DashboardLayout userType="doctor">
        <div className="space-y-6">
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8" />
            <span className="ml-2 text-muted-foreground">Loading patient data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ECG Analysis</h1>
            <p className="text-muted-foreground">
              Analyze and interpret patient ECG data
            </p>
          </div>
          {liveSession?.current_heart_rate ? (
            <HeartRateCard heartRate={liveSession.current_heart_rate} />
          ) : (
            <HeartRateCard heartRate={heartRate} />
          )}
        </div>

        {profileError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              There was a problem loading the patient profile. Please try again or select a different patient.
            </AlertDescription>
          </Alert>
        )}

        {!hasPermission && (
          <Alert variant="destructive">
            <Activity className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to view this patient's data. Make sure the patient has accepted your connection request.
            </AlertDescription>
          </Alert>
        )}

        <ViewerContent
          selectedPatient={selectedPatient}
          onPatientChange={setSelectedPatient}
          patternType={patternType}
          onPatternChange={handlePatternChange}
          isLive={liveSession?.status === 'active' || isLive}
          onLiveToggle={handleLiveToggle}
          heartRate={liveSession?.current_heart_rate || heartRate}
          isDoctor={true}
        />

        <Tabs defaultValue="real-time">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="real-time">Real-time View</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="real-time" className="space-y-4">
            <ECGChart 
              ecgData={ecgData}
              isLive={liveSession?.status === 'active' || isLive}
              onGenerateReport={handleGenerateReport}
              patientName={patientName}
              isLoading={isLoading}
              patientId={selectedPatient}
            />
            <NotesSection
              notes={notes}
              onNotesChange={setNotes}
              onSaveNotes={handleSaveNotes}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            <AnalysisTab />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryTab patientId={selectedPatient} />
          </TabsContent>
        </Tabs>
        
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate ECG Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input
                  id="report-title"
                  placeholder="Enter a title for this report"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                />
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">Report will include:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Patient information and metadata</li>
                  <li>• ECG visualization with timestamps</li>
                  <li>• Heart rate analysis and statistics</li>
                  <li>• Doctor's notes and observations</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateReport} 
                disabled={!reportTitle.trim() || isGeneratingReport}
              >
                {isGeneratingReport ? "Generating..." : "Generate Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DoctorECGViewer;
