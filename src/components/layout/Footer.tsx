
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">HeartSync</h3>
            <p className="text-sm text-muted-foreground">
              Remote ECG monitoring made simple and accessible for patients and doctors.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Live ECG Monitoring</li>
              <li>Doctor-Patient Connection</li>
              <li>Detailed Reports</li>
              <li>Secure Data Storage</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Documentation</li>
              <li>Support</li>
              <li>FAQ</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@heartsync.com</li>
              <li>Phone: +1 (123) 456-7890</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} HeartSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
