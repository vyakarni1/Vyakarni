
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface UnifiedNavigationProps {
  variant?: "home" | "default";
  className?: string;
}

const UnifiedNavigation = ({ variant = "default", className = "" }: UnifiedNavigationProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      };
      fetchProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  const isHome = variant === "home";
  
  // Dynamic classes based on variant
  const headerClasses = isHome 
    ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/30 sticky top-0 z-50"
    : "bg-white/80 backdrop-blur-md shadow-sm border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300";

  const containerClasses = isHome ? "container mx-auto px-6 py-4" : "container mx-auto px-6";
  const navClasses = isHome ? "flex justify-between items-center" : "flex items-center justify-between h-16";
  
  const logoClasses = isHome 
    ? "flex items-center space-x-2"
    : "flex items-center space-x-2 transition-all duration-200 hover:scale-105";
    
  const logoImageClasses = isHome 
    ? "h-10 w-10 transition-transform duration-200 hover:scale-105"
    : "h-8 w-8";
    
  const logoTextClasses = isHome 
    ? "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in"
    : "text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent";

  return (
    <header className={`${headerClasses} ${className}`}>
      <div className={containerClasses}>
        <nav className={navClasses}>
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className={logoClasses}>
              <img 
                src="/lovable-uploads/827c910f-4ee8-43bc-adf6-6f3a5552eb9b.png" 
                alt="व्याकरणी Logo" 
                className={logoImageClasses}
              />
              <span className={logoTextClasses}>
                व्याकरणी
              </span>
            </Link>
            {isHome && (
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                >
                  डैशबोर्ड
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/grammar-checker" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                >
                  व्याकरण जांच
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/text-editor" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                >
                  टेक्स्ट एडिटर
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/pricing" 
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                >
                  प्राइसिंग
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <span className="text-sm text-gray-600 truncate max-w-32 lg:max-w-none">
                  नमस्ते, {profile?.name || user.email?.split('@')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  लॉग आउट
                </Button>
              </>
            ) : (
              <>
                {!isHome && (
                  <>
                    <Link 
                      to="/about" 
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                    >
                      हमारे बारे में
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                    >
                      संपर्क
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link 
                      to="/pricing" 
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
                    >
                      प्राइसिंग
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}
                <div className="flex space-x-3">
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`transition-all duration-200 ${isHome ? 'hover:bg-blue-50 hover:border-blue-300 transition-all duration-300' : 'hover:scale-105'}`}
                    >
                      लॉगिन
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm" 
                      className={`transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${isHome ? 'transform hover:scale-105 transition-all duration-300 shadow-lg' : 'hover:scale-105'}`}
                    >
                      रजिस्टर करें
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    डैशबोर्ड
                  </Link>
                  <Link 
                    to="/grammar-checker" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    व्याकरण जांच
                  </Link>
                  <Link 
                    to="/text-editor" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    टेक्स्ट एडिटर
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    प्राइसिंग
                  </Link>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      नमस्ते, {profile?.name || user.email?.split('@')[0]}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start mt-2"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      लॉग आउट
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {!isHome && (
                    <>
                      <Link 
                        to="/about" 
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        हमारे बारे में
                      </Link>
                      <Link 
                        to="/contact" 
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        संपर्क
                      </Link>
                      <Link 
                        to="/pricing" 
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        प्राइसिंग
                      </Link>
                    </>
                  )}
                  <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full transition-all duration-200">
                        लॉगिन
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600">
                        रजिस्टर करें
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default UnifiedNavigation;
