import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { ArrowRight, Droplet, Heart, HelpCircle, Shield, Siren, User } from "lucide-react";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <User className="h-8 w-8 text-medical-blue" />,
      title: "Personal Profiles",
      description: "Create your donor profile with blood type, location, and availability status."
    },
    {
      icon: <Droplet className="h-8 w-8 text-blood" />,
      title: "Find Donors",
      description: "Easily search for compatible donors based on blood type and location."
    },
    {
      icon: <Heart className="h-8 w-8 text-medical-blue" />,
      title: "Request Donations",
      description: "Send donation requests directly to compatible donors in your area."
    },
    {
      icon: <Shield className="h-8 w-8 text-blood" />,
      title: "Verified Accounts",
      description: "All donor profiles are verified by our admins for safety and authenticity."
    },
    {
      icon: <Siren className="h-8 w-8 text-medical-blue" />,
      title: "Urgent Requests",
      description: "Get notified about urgent blood donation needs in your community."
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-blood" />,
      title: "24/7 Support",
      description: "Our support team is available around the clock to assist you."
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HemoHelpers Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform connects blood donors with recipients through a simple and secure process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="bg-background rounded-xl p-6 shadow-elevation-low hover-lift flex flex-col h-full"
              >
                <div className="rounded-full bg-secondary w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/profile">
                Create Your Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute -left-20 top-20 w-80 h-80 rounded-full bg-blood/5 blur-3xl -z-10"></div>
        <div className="absolute -right-20 bottom-20 w-80 h-80 rounded-full bg-medical-blue/5 blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blood/10 to-medical-blue/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <div className="md:flex items-center justify-between gap-8">
              <div className="mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to save lives?</h2>
                <p className="text-lg text-foreground/80 max-w-2xl">
                  Join our community of blood donors today and help those in need. Your donation can save up to three lives.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="rounded-full bg-blood hover:bg-blood/90 text-white"
                  asChild
                >
                  <Link to="/auth/sign-up">Register as Donor</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full border-medical-blue text-medical-blue hover:bg-medical-blue/10"
                  asChild
                >
                  <Link to="/search">Find Donors</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Droplet className="h-6 w-6 text-blood" />
              <span className="font-semibold text-xl">MCKJ HemoHelpers</span>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-6 md:mb-0 justify-center">
              <Link to="/" className="text-foreground/70 hover:text-foreground">Home</Link>
              <Link to="/profile" className="text-foreground/70 hover:text-foreground">Profile</Link>
              <Link to="/search" className="text-foreground/70 hover:text-foreground">Donors</Link>
              <Link to="/admin" className="text-foreground/70 hover:text-foreground">Admin</Link>
              <a href="#" className="text-foreground/70 hover:text-foreground">About</a>
              <a href="#" className="text-foreground/70 hover:text-foreground">Contact</a>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MCKJ HemoHelpers. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
