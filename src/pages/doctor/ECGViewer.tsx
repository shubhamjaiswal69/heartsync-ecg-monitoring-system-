
import { useState } from "react";
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

const DoctorECGViewer = () => {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(patientId || "1");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  
  const {
    patternType,
    ecgData,
    isLive,
    heartRate,
    handlePatternChange,
    handleLiveToggle
  } = useECGData();
  
  const handleSaveNotes = () => {
    if (!notes.trim()) return;
    toast({
      title: "Notes Saved",
      description: "Patient notes have been saved successfully."
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "ECG report has been generated and is ready for download."
    });
  };
  
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ECG Viewer</h1>
            <p className="text-muted-foreground">
              View and analyze patient ECG data
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
