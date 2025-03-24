
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Droplet, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const statsItems = [
    { icon: <Droplet className="h-6 w-6 text-blood" />, value: "8,250", label: "Blood Donations Made" },
    { icon: <Users className="h-6 w-6 text-medical-blue" />, value: "2,100", label: "Registered Donors" },
    { icon: <Heart className="h-6 w-6 text-blood" />, value: "7,350", label: "Lives Saved" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background circles */}
      <div className="absolute right-0 top-40 w-60 h-60 rounded-full bg-blood/5 blur-3xl -z-10"></div>
      <div className="absolute left-0 bottom-40 w-80 h-80 rounded-full bg-medical-blue/5 blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <div 
            className={cn(
              "space-y-6 transition-all duration-1000 transform", 
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <div className="inline-block rounded-full bg-blood/10 px-3 py-1 text-sm font-medium text-blood animate-pulse-subtle">
              Every donation saves lives
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Connecting <span className="text-blood">Donors</span> with Those in <span className="text-medical-blue">Need</span>
            </h1>
            <p className="text-lg text-foreground/70 md:pr-10">
              Join our community of blood donors and connect directly with recipients in your area. Your donation can save up to three lives.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                size="lg" 
                className="rounded-full bg-blood hover:bg-blood/90 text-white px-6"
                asChild
              >
                <Link to="/auth/sign-up">
                  Register as Donor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
          
          {/* Hero image/visual */}
          <div 
            className={cn(
              "relative transition-all duration-1000 delay-300 transform", 
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            <div className="aspect-square max-w-lg mx-auto relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full bg-blood-light animate-pulse-subtle flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blood" />
                </div>
              </div>
              
              {/* Blood type cards */}
              {['A+', 'B-', 'O+', 'AB+'].map((type, i) => (
                <div 
                  key={type}
                  className={cn(
                    "absolute glass-card rounded-xl p-4 shadow-elevation-medium animate-fade-in transition-all duration-300 hover-lift",
                    i === 0 && "top-10 -left-4",
                    i === 1 && "top-1/4 right-0",
                    i === 2 && "bottom-1/4 -left-10",
                    i === 3 && "bottom-20 right-10",
                  )}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blood-light flex items-center justify-center">
                      <span className="font-bold text-blood">{type}</span>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/70">Blood Type</p>
                      <p className="font-semibold">{type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div 
          className={cn(
            "grid md:grid-cols-3 gap-6 mt-24 transition-all duration-1000 delay-500 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          {statsItems.map((stat, i) => (
            <div 
              key={i} 
              className="glass-card rounded-2xl p-6 text-center hover-lift"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-secondary p-3 mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-foreground/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
