
import { Link } from "react-router-dom";
import { Activity, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  status: string;
  lastActive: string;
  condition: string;
  email: string;
  phone: string;
}

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  return (
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
  );
}
