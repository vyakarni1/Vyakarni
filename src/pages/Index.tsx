
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import GrammarChecker from "@/components/GrammarChecker";
import { UsageLimitDisplay } from "@/components/UsageLimitDisplay";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      // Fetch user profile
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
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
              <img 
                src="/lovable-uploads/827c910f-4ee8-43bc-adf6-6f3a5552eb9b.png" 
                alt="व्याकरणी Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8"
              />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                व्याकरणी
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">डैशबोर्ड</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="sm">प्राइसिंग</Button>
              </Link>
              {user && (
                <>
                  <span className="text-sm text-gray-600 truncate max-w-32 lg:max-w-none">
                    नमस्ते, {profile?.name || user.email?.split('@')[0]}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">लॉग आउट</span>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-3 space-y-2">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">डैशबोर्ड</Button>
              </Link>
              <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full justify-start">प्राइसिंग</Button>
              </Link>
              {user && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
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
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    लॉग आउट
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto py-4 sm:py-8">
        <UsageLimitDisplay />
        <GrammarChecker />
      </div>
    </div>
  );
};

export default Index;
