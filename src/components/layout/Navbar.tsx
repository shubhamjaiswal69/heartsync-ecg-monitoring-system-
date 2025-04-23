
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">❤️ HeartSync</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/60 hover:text-foreground transition">Home</Link>
          <Link to="/features" className="text-foreground/60 hover:text-foreground transition">Features</Link>
          <Link to="/about" className="text-foreground/60 hover:text-foreground transition">About</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[75vw] sm:w-[350px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-4 border-b">
                <span className="text-xl font-bold text-primary">❤️ HeartSync</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4 py-6">
                <Link to="/" className="text-foreground px-4 py-2 rounded-md hover:bg-muted" onClick={closeSheet}>
                  Home
                </Link>
                <Link to="/features" className="text-foreground px-4 py-2 rounded-md hover:bg-muted" onClick={closeSheet}>
                  Features
                </Link>
                <Link to="/about" className="text-foreground px-4 py-2 rounded-md hover:bg-muted" onClick={closeSheet}>
                  About
                </Link>
              </nav>
              <div className="flex flex-col gap-4 mt-auto border-t py-6">
                <Button variant="outline" asChild className="w-full" onClick={closeSheet}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full" onClick={closeSheet}>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
