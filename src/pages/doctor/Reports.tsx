
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Download, Eye, Plus, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock reports data
const reports = [
  {
    id: 1,
    title: "Monthly ECG Report - John Doe",
    patientId: "1",
    patientName: "John Doe",
    date: "June 1, 2025",
    type: "monthly",
    status: "generated"
  },
  {
    id: 2,
    title: "Cardiac Evaluation - Sarah Johnson",
    patientId: "2",
    patientName: "Sarah Johnson",
    date: "May 15, 2025",
    type: "evaluation",
    status: "generated"
  },
  {
    id: 3,
    title: "Weekly ECG Summary - Michael Smith",
    patientId: "3",
    patientName: "Michael Smith",
    date: "May 7, 2025",
    type: "weekly",
    status: "generated"
  }
];

// Mock patients
const patients = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Michael Smith" }
];

const DoctorReports = () => {
  const [activeTab, setActiveTab] = useState<"all" | "generated" | "drafts">("all");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const { toast } = useToast();
  
  const filteredReports = reports.filter(report => 
    activeTab === "all" || report.status === activeTab
  );
  
  const handleCreateReport = () => {
    if (!selectedPatient || !reportType || !reportTitle) return;
    
    toast({
      title: "Report Created",
      description: `The report "${reportTitle}" has been created and saved as a draft.`
    });
    
    // Clear form
    setSelectedPatient("");
    setReportType("");
    setReportTitle("");
    setReportContent("");
  };
  
  const handleDownload = (reportId: number) => {
    toast({
      title: "Report Downloaded",
      description: `Report #${reportId} has been downloaded successfully.`
    });
  };
  
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Create and manage ECG reports for your patients
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Generate a new ECG report for a patient
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger id="patient">
                      <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                      <SelectItem value="monthly">Monthly Report</SelectItem>
                      <SelectItem value="evaluation">Cardiac Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input 
                    id="report-title"
                    placeholder="Enter report title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-content">Report Content</Label>
                  <Textarea 
                    id="report-content"
                    placeholder="Enter your observations and conclusions..."
                    className="min-h-[150px]"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button onClick={handleCreateReport}>Generate Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "all" | "generated" | "drafts")}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="generated">Generated</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {renderReportsList(filteredReports, handleDownload)}
          </TabsContent>
          <TabsContent value="generated" className="space-y-4">
            {renderReportsList(filteredReports, handleDownload)}
          </TabsContent>
          <TabsContent value="drafts" className="space-y-4">
            {renderReportsList([], handleDownload)}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper function to render reports list
const renderReportsList = (reports: any[], handleDownload: (id: number) => void) => {
  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <File className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No reports found</h3>
          <p className="text-sm text-muted-foreground">
            No reports match your current filters
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return reports.map(report => (
    <Card key={report.id}>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">{report.title}</h3>
              <p className="text-sm text-muted-foreground">{report.date}</p>
            </div>
            <Badge variant={report.status === "generated" ? "default" : "outline"}>
              {report.status === "generated" ? "Generated" : "Draft"}
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Patient: {report.patientName}</p>
            <p className="text-sm text-muted-foreground">
              Type: {report.type === "monthly" ? "Monthly Report" : 
                    report.type === "weekly" ? "Weekly Summary" : 
                    "Cardiac Evaluation"}
            </p>
          </div>
        </div>
        <div className="md:w-60 p-6 flex md:flex-col gap-4 items-center justify-center">
          <Button className="w-full" onClick={() => handleDownload(report.id)}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>
    </Card>
  ));
};

export default DoctorReports;
