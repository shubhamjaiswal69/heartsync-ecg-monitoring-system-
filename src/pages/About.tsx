import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
const About = () => {
  return <Layout>
      <div className="container py-16 md:py-20 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">About HeartSync</h1>
          <p className="text-xl text-muted-foreground">
            Our mission is to make heart health monitoring accessible to everyone
          </p>
        </div>

        <div className="grid gap-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-lg text-muted-foreground">HeartSync was founded in 2024 with a simple but powerful mission: make professional-grade ECG monitoring accessible to everyone, everywhere.</p>
              <p className="text-lg text-muted-foreground">
                What started as a personal project quickly grew into a comprehensive platform that 
                connects patients with healthcare professionals, providing real-time heart monitoring 
                and analysis tools that were previously only available in clinical settings.
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 aspect-square flex items-center justify-center">
              <span className="text-9xl">❤️</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center">Our Mission</h2>
                <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
                  "To empower individuals to take control of their heart health through accessible, 
                  affordable, and user-friendly remote monitoring solutions."
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="rounded-full bg-primary/10 w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="text-3xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Shubham Jaiswal</h3>
                    <p className="text-muted-foreground">Founder & CEO</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cardiologist with 15+ years of experience. Passionate about preventive cardiology 
                    and making heart health accessible to everyone.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="rounded-full bg-primary/10 w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="text-3xl">👩‍💻</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Sarah Chen</h3>
                    <p className="text-muted-foreground">CTO</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Biomedical engineer with expertise in wearable technology. Leads our hardware and 
                    software development efforts to create seamless ECG solutions.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="rounded-full bg-primary/10 w-24 h-24 mx-auto flex items-center justify-center">
                    <span className="text-3xl">👨‍🔬</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Dr. Michael Rodriguez</h3>
                    <p className="text-muted-foreground">Medical Director</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Electrophysiologist specializing in cardiac arrhythmias. Ensures our technology 
                    meets the highest medical standards and provides clinical insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Our Approach</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Patient-Centered Design</h3>
                <p className="text-muted-foreground">
                  We believe that healthcare technology should be designed around the needs of patients. 
                  Our platform is intuitive, easy to use, and focuses on providing value to both patients 
                  and healthcare providers.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Clinical Excellence</h3>
                <p className="text-muted-foreground">
                  All our products and features are developed in close collaboration with cardiologists 
                  and healthcare professionals to ensure they meet the highest standards of clinical accuracy 
                  and usefulness.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Accessibility</h3>
                <p className="text-muted-foreground">
                  We're committed to making heart health monitoring accessible to everyone, regardless of 
                  technical expertise or location. Our solutions work seamlessly across different devices 
                  and connectivity options.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Data Security</h3>
                <p className="text-muted-foreground">
                  We take the security and privacy of health data extremely seriously. Our platform uses 
                  state-of-the-art encryption and security measures to protect sensitive information and 
                  comply with healthcare regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default About;