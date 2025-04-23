import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AddPatientDialog } from "@/components/doctor/patients/AddPatientDialog";
import { SearchBar } from "@/components/doctor/patients/SearchBar";
import { PatientCard } from "@/components/doctor/patients/PatientCard";

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
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive" | "pending">("all");
  
  const filteredPatients = patients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(patient => 
      activeTab === "all" ? true : patient.status === activeTab
    );
  
  const renderPatientsList = (patients: typeof filteredPatients) => {
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
      <PatientCard key={patient.id} patient={patient} />
    ));
  };
  
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
          <AddPatientDialog />
        </div>
        
        <div className="flex items-center gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
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

export default DoctorPatientList;
