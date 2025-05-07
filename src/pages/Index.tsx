import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Remote ECG Monitoring For Everyone
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect patients and doctors with real-time heart monitoring. 
                Simple, secure, and accessible from anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md bg-card p-6 shadow-lg border rounded-lg">
                <div className="aspect-video bg-primary/20 rounded-md flex items-center justify-center">
                  <span className="text-5xl">❤️</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-muted rounded-full w-3/4"></div>
                  <div className="h-3 bg-muted rounded-full w-1/2"></div>
                  <div className="h-3 bg-muted rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How HeartSync Works</h2>
            <p className="text-lg text-muted-foreground">
              Our platform connects ECG devices directly to healthcare professionals,
              making remote heart monitoring simple and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            title: "For Patients",
            description: "Connect your ECG device, monitor your heart in real-time, and share results with your doctor securely.",
            features: ["Easy device pairing", "Real-time monitoring", "Secure data storage", "Doctor invitation system"]
          }, {
            title: "For Doctors",
            description: "Access patient ECG data in real-time, analyze results, and generate detailed reports.",
            features: ["Patient management", "Live ECG viewing", "Historical data access", "Report generation"]
          }, {
            title: "Technical Details",
            description: "Built with security and reliability in mind, HeartSync ensures your health data is protected.",
            features: ["End-to-end encryption", "HIPAA compliant", "High-availability systems", "Regular backups"]
          }].map((item, index) => <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, i) => <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/10">
        <div className="container text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of patients and healthcare professionals already using HeartSync
            for remote heart monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;