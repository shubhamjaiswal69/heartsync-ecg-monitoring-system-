
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientECGViewer from "./pages/patient/ECGViewer";
import PatientInviteDoctor from "./pages/patient/InviteDoctor";
import PatientHistory from "./pages/patient/History";
import PatientReports from "./pages/patient/Reports";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatientList from "./pages/doctor/PatientList";
import DoctorECGViewer from "./pages/doctor/ECGViewer";
import DoctorReports from "./pages/doctor/Reports";
import DoctorManageInvitations from "./pages/doctor/ManageInvitations";
import DoctorPreviousConnections from "./pages/doctor/PreviousConnections";
import Features from "./pages/Features";
import About from "./pages/About";
import ProfilePage from "./pages/profile/ProfilePage";
import PatientProfile from "@/pages/doctor/PatientProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/ecg-viewer" element={<PatientECGViewer />} />
            <Route path="/patient/invite-doctor" element={<PatientInviteDoctor />} />
            <Route path="/patient/history" element={<PatientHistory />} />
            <Route path="/patient/reports" element={<PatientReports />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatientList />} />
            <Route path="/doctor/ecg-viewer/:patientId?" element={<DoctorECGViewer />} />
            <Route path="/doctor/reports" element={<DoctorReports />} />
            <Route path="/doctor/manage-invitations" element={<DoctorManageInvitations />} />
            <Route path="/doctor/previous-connections" element={<DoctorPreviousConnections />} />
            <Route path="/doctor/patient-profile/:patientId" element={<PatientProfile />} />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
            
            {/* Profile Routes */}
            <Route path="/patient/profile" element={<ProfilePage />} />
            <Route path="/doctor/profile" element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
