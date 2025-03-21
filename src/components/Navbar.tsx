
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Droplet, Menu, User, Search, ShieldCheck, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
    { title: "Home", href: "/", icon: <Droplet className="h-4 w-4" /> },
    { title: "Profile", href: "/profile", icon: <User className="h-4 w-4" /> },
    { title: "Search", href: "/search", icon: <Search className="h-4 w-4" /> },
  ];

  // Only show Admin link for admin users
  if (user && isAdmin()) {
    navLinks.push({ 
      title: "Admin", 
      href: "/admin", 
      icon: <ShieldCheck className="h-4 w-4" /> 
    });
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 font-medium text-xl animate-fade-in"
          >
            <Droplet className="h-6 w-6 text-blood" />
            <span className="font-semibold">HemoHelpers Khatri</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                )}
              >
                <span className="flex items-center space-x-1.5">
                  {link.icon}
                  <span>{link.title}</span>
                </span>
              </Link>
            ))}
            
            {user ? (
              <Button 
                size="sm" 
                variant="outline"
                className="ml-4 rounded-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1" /> 
                Sign Out
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="ml-4 rounded-full bg-primary text-white"
                asChild
              >
                <Link to="/auth/signin">
                  <LogIn className="h-4 w-4 mr-1" /> 
                  Sign In
                </Link>
              </Button>
            )}
            
            {user && (
              <Button 
                size="sm" 
                className="ml-2 rounded-full bg-blood text-white hover:bg-blood/90"
              >
                Donate Now
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden h-screen bg-background animate-slide-in">
          <nav className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-lg font-medium flex items-center space-x-3",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                )}
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              {user ? (
                <Button 
                  className="w-full rounded-lg"
                  variant="outline"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" /> 
                  Sign Out
                </Button>
              ) : (
                <Button 
                  className="w-full rounded-lg"
                  asChild
                >
                  <Link to="/auth/signin">
                    <LogIn className="h-4 w-4 mr-2" /> 
                    Sign In
                  </Link>
                </Button>
              )}
              
              {user && (
                <Button 
                  className="w-full rounded-full bg-blood text-white hover:bg-blood/90 py-6"
                >
                  Donate Now
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
