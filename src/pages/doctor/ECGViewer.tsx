
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
import { patients } from "@/data/mockEcgData";
import { HeartRateCard } from "@/components/ecg/HeartRateCard";
import { supabase } from "@/integrations/supabase/client";

const DoctorECGViewer = () => {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "1");
  const [notes, setNotes] = useState("");
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);
  const { toast } = useToast();
  
  const {
    patternType,
    ecgData,
    isLive,
    heartRate,
    handlePatternChange,
    handleLiveToggle
  } = useECGData();
  
  // Fetch patient data when selected patient changes
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setIsLoadingPatient(true);
        
        // In a real app, this would be a call to Supabase
        // For now, we'll simulate it with our mock data
        const patient = patients.find(p => p.id === selectedPatient);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setPatientData(patient);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPatient(false);
      }
    };
    
    fetchPatientData();
  }, [selectedPatient, toast]);
  
  const handleSaveNotes = async () => {
    if (!notes.trim()) return;
    
    try {
      // In a real app, this would save to Supabase
      // For now, we'll just show a success message
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
  
  const patientName = patientData?.name || "Selected Patient";
  
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
          <HeartRateCard heartRate={heartRate} />
        </div>

        <ViewerContent
          selectedPatient={selectedPatient}
          onPatientChange={setSelectedPatient}
          patternType={patternType}
          onPatternChange={handlePatternChange}
          isLive={isLive}
          onLiveToggle={handleLiveToggle}
          heartRate={heartRate}
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
              isLive={isLive}
              onGenerateReport={handleGenerateReport}
              patientName={patientName}
              isLoading={isLoadingPatient}
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
