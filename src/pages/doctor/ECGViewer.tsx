
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
import { Activity } from "lucide-react";

const DoctorECGViewer = () => {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "1");
  const [notes, setNotes] = useState("");
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const [hasPermission, setHasPermission] = useState(true); // Default to true to avoid flash of permission error
  const { toast } = useToast();
  
  const { profile, loading: loadingProfile } = usePatientProfile(selectedPatient);
  const { session: liveSession, loading: loadingSession } = useLiveECGSession(selectedPatient);
  
  const {
    patternType,
    ecgData,
    isLive,
    heartRate,
    handlePatternChange,
    handleLiveToggle
  } = useECGData();
  
  // Check if doctor has permission to view this patient's data
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!selectedPatient) return;
        
        const { data, error } = await supabase.rpc('is_connected_to_doctor', {
          doctor_id: selectedPatient
        });
        
        if (error) throw error;
        
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
    toast({
      title: "Report Generated",
      description: "ECG report has been generated and is ready for download."
    });
  };
  
  const patientName = profile?.full_name || "Selected Patient";
  const isLoading = isLoadingPatient || loadingProfile;
  
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
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DoctorECGViewer;
