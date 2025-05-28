
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import GrammarChecker from "@/components/GrammarChecker";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

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
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">डैशबोर्ड</Button>
              </Link>
              {user && (
                <>
                  <span className="text-gray-600">नमस्ते, {profile?.name || user.email}</span>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    लॉग आउट
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <GrammarChecker />
      </div>
    </div>
  );
};

export default Index;
