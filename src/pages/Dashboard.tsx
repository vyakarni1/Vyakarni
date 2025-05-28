
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useUsageStats } from "@/hooks/useUsageStats";
import UsageStatsCards from "@/components/UsageStatsCards";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const { stats, loading: statsLoading } = useUsageStats();

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">नमस्ते, {profile?.name || user.email}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                लॉग आउट
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">डैशबोर्ड</h1>
          <p className="text-gray-600">आपके खाते का अवलोकन और उपयोग की जानकारी</p>
        </div>

        {/* Usage Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">उपयोग के आंकड़े</h2>
          <UsageStatsCards stats={stats} loading={statsLoading} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">प्रोफाइल</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.name || "User"}</div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>व्याकरण सुधारक</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                अपने हिंदी टेक्स्ट को AI की मदद से सुधारें
              </p>
              <Link to="/grammar-checker">
                <Button className="w-full">
                  व्याकरण सुधारक खोलें
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>आपकी प्रगति</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {stats.total_corrections === 0 
                  ? "आपने अभी तक कोई टेक्स्ट सुधारा नहीं है। शुरुआत करने के लिए व्याकरण सुधारक का उपयोग करें।"
                  : `बधाई हो! आपने अब तक ${stats.total_corrections} सुधार किए हैं।`
                }
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>इस महीने</span>
                  <span>{stats.corrections_this_month} सुधार</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((stats.corrections_this_month / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
