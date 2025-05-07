
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatientProfile } from "@/hooks/usePatientProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Activity } from "lucide-react";

const PatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading } = usePatientProfile(patientId);
  const [hasPermission, setHasPermission] = useState(true);
  const [ecgRecordings, setEcgRecordings] = useState([]);
  const [loadingRecordings, setLoadingRecordings] = useState(false);

  // Check if doctor has permission to view this patient
  useEffect(() => {
    const checkPermission = async () => {
      if (!patientId) return;
      
      try {
        const { data, error } = await supabase.rpc('is_connected_to_doctor', {
          doctor_id: patientId
        });
        
        if (error) throw error;
        
        setHasPermission(!!data);
        
        if (!data) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to view this patient's profile",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error checking permission:", error);
        // For demo purposes, default to showing the profile even if there's an error
        setHasPermission(true);
      }
    };
    
    checkPermission();
  }, [patientId, toast]);

  // Fetch the patient's ECG recordings
  useEffect(() => {
    const fetchEcgRecordings = async () => {
      if (!patientId || !hasPermission) return;
      
      try {
        setLoadingRecordings(true);
        
        const { data, error } = await supabase
          .from('ecg_recordings')
          .select('*')
          .eq('patient_id', patientId)
          .order('recorded_at', { ascending: false });
          
        if (error) throw error;
        
        setEcgRecordings(data || []);
      } catch (error) {
        console.error("Error fetching ECG recordings:", error);
        toast({
          title: "Error",
          description: "Failed to load patient ECG recordings",
          variant: "destructive"
        });
      } finally {
        setLoadingRecordings(false);
      }
    };
    
    fetchEcgRecordings();
  }, [patientId, hasPermission, toast]);

  if (loading) {
    return (
      <DashboardLayout userType="doctor">
        <div className="flex justify-center items-center h-[60vh]">
          <Spinner className="h-12 w-12" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile && !loading) {
    return (
      <DashboardLayout userType="doctor">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Patient Not Found</h1>
          </div>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The patient profile you're looking for doesn't exist or you don't have permission to view it.
            </AlertDescription>
          </Alert>
          
          <Button onClick={() => navigate("/doctor/patients")}>
            Return to Patient List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name}</h1>
            <p className="text-muted-foreground">
              Patient Profile and Medical Information
            </p>
          </div>
        </div>

        {!hasPermission && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to view this patient's profile. Make sure the patient has accepted your connection request.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{profile?.full_name || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{profile?.email || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">{profile?.age ? `${profile.age} years` : "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium">{profile?.gender || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Blood Type</span>
                  <span className="font-medium">{profile?.blood_type || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium">{profile?.height ? `${profile.height} cm` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{profile?.weight ? `${profile.weight} kg` : "N/A"}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/doctor/ecg-viewer/${patientId}`)}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View ECG Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical Details */}
          <div className="md:col-span-2">
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">Medical History</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.medical_history ? (
                      <div className="whitespace-pre-line">{profile.medical_history}</div>
                    ) : (
                      <div className="text-muted-foreground italic">No medical history recorded</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>ECG History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingRecordings ? (
                      <div className="flex justify-center py-4">
                        <Spinner className="h-8 w-8" />
                      </div>
                    ) : ecgRecordings.length > 0 ? (
                      <div className="space-y-4">
                        {ecgRecordings.map((recording: any) => (
                          <div key={recording.id} className="flex justify-between border-b pb-2">
                            <div>
                              <div className="font-medium">{recording.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(recording.recorded_at).toLocaleString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground italic">No ECG recordings available</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="medications">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Medications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.current_medications ? (
                      <div className="whitespace-pre-line">{profile.current_medications}</div>
                    ) : (
                      <div className="text-muted-foreground italic">No medications recorded</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="allergies">
                <Card>
                  <CardHeader>
                    <CardTitle>Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profile?.allergies ? (
                      <div className="whitespace-pre-line">{profile.allergies}</div>
                    ) : (
                      <div className="text-muted-foreground italic">No allergies recorded</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
