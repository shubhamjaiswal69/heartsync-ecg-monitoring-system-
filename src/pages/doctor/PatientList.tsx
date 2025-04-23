
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, UserPlus, Activity, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock patient data
const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    status: "active",
    lastActive: "Today, 10:30 AM",
    condition: "Arrhythmia",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    age: 62,
    gender: "Female",
    status: "active",
    lastActive: "Yesterday, 3:45 PM",
    condition: "Hypertension",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678"
  },
  {
    id: 3,
    name: "Michael Smith",
    age: 57,
    gender: "Male",
    status: "inactive",
    lastActive: "June 10, 9:15 AM",
    condition: "Post-heart attack",
    email: "michael.smith@example.com",
    phone: "+1 (555) 345-6789"
  },
  {
    id: 4,
    name: "Emily Wilson",
    age: 39,
    gender: "Female",
    status: "pending",
    lastActive: "Never",
    condition: "Unknown",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 456-7890"
  }
];

const DoctorPatientList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive" | "pending">("all");
  const { toast } = useToast();
  
  const handleAddPatient = () => {
    if (!referralCode.trim()) return;
    
    toast({
      title: "Patient connection requested",
      description: "Your request has been sent. Waiting for patient approval."
    });
    
    setReferralCode("");
  };
  
  const filteredPatients = patients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(patient => 
      activeTab === "all" ? true : patient.status === activeTab
    );
  
  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground">
              Manage and monitor your connected patients
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Enter the patient's referral code to connect with them.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="referral-code">Referral Code</Label>
                  <Input 
                    id="referral-code"
                    placeholder="e.g., HEARTSYNC-12345"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddPatient}>Connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or condition..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "all" | "active" | "inactive" | "pending")}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {renderPatientsList(filteredPatients)}
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            {renderPatientsList(filteredPatients)}
          </TabsContent>
          <TabsContent value="inactive" className="space-y-4">
            {renderPatientsList(filteredPatients)}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            {renderPatientsList(filteredPatients)}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper function to render patients list
const renderPatientsList = (patients: any[]) => {
  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <UserPlus className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No patients found</h3>
          <p className="text-sm text-muted-foreground">
            No patients match your current filters
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return patients.map(patient => (
    <Card key={patient.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{patient.name}</h3>
                <Badge variant={
                  patient.status === "active" ? "default" : 
                  patient.status === "inactive" ? "secondary" : 
                  "outline"
                }>
                  {patient.status === "active" ? "Active" : 
                   patient.status === "inactive" ? "Inactive" : 
                   "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender} • {patient.condition}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="text-sm">{patient.lastActive}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="text-sm">{patient.email}</p>
              <p className="text-sm">{patient.phone}</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-60 p-6 flex md:flex-col gap-2">
          <Button asChild className="w-full">
            <Link to={`/doctor/ecg-viewer/${patient.id}`}>
              <Activity className="mr-2 h-4 w-4" />
              View ECG
            </Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Patient Profile
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
    </Card>
  ));
};

export default DoctorPatientList;
