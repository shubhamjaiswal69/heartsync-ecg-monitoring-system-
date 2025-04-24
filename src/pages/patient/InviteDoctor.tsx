import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ReferralCodeGenerator } from "@/components/invite/ReferralCodeGenerator";
import { ActiveReferralCodes } from "@/components/invite/ActiveReferralCodes";

const PatientInviteDoctor = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      toast({
        title: "Invitation sent",
        description: `Invitation email has been sent to ${email}.`
      });
    }, 1500);
  };

  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Invite a Doctor</h1>
        <p className="text-muted-foreground">
          Connect with healthcare professionals to share your ECG data and get remote consultations.
        </p>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="code">Referral Code</TabsTrigger>
            <TabsTrigger value="email">Email Invitation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-6">
            <ReferralCodeGenerator />
            <ActiveReferralCodes />
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Send Email Invitation</CardTitle>
                <CardDescription>
                  Directly send an invitation to your doctor's email
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSendInvite}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Doctor's Email</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <textarea
                      id="message"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Hello Dr. Smith, I'd like to share my ECG data with you for remote monitoring..."
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Sending Invitation..."
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Connected Doctors</CardTitle>
            <CardDescription>
              Healthcare professionals currently connected to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Amanda Smith</p>
                    <p className="text-xs text-muted-foreground">Cardiologist</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dr. Robert Johnson</p>
                    <p className="text-xs text-muted-foreground">General Practitioner</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientInviteDoctor;
