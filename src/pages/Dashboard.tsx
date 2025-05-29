import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import UsageStatsCards from "@/components/UsageStatsCards";
import PlanInfoCard from "@/components/PlanInfoCard";
import UsageProgressCard from "@/components/UsageProgressCard";
import SmartRecommendationsCard from "@/components/SmartRecommendationsCard";
import Footer from "@/components/Footer";
import { useSubscription } from "@/hooks/useSubscription";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const { subscription } = useSubscription();

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                व्याकरणी
              </div>
              <Sparkles className="h-6 w-6 text-purple-500" />
              {subscription && (
                <div className="hidden md:flex items-center ml-4">
                  <span className="text-sm text-gray-500 mr-2">प्लान:</span>
                  <span className="text-sm font-medium text-gray-700">{subscription.plan_name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{profile?.name || user.email?.split('@')[0]}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                <LogOut className="h-4 w-4 mr-2" />
                लॉग आउट
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              डैशबोर्ड
            </h1>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-lg text-gray-600">आपके खाते का विस्तृत अवलोकन</p>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
            <p className="text-blue-800">
              🎉 नमस्कार <span className="font-semibold">{profile?.name || user.email?.split('@')[0]}</span>! 
              आज भी अपनी हिंदी लेखन को बेहतर बनाएं।
            </p>
          </div>
        </div>

        {/* Plan and Usage Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <PlanInfoCard />
          <UsageProgressCard />
          <SmartRecommendationsCard />
        </div>

        {/* Real-time Usage Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📊 विस्तृत उपयोग की जानकारी
          </h2>
          <UsageStatsCards />
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  व्यक्तिगत जानकारी
                </CardTitle>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(profile?.name || user.email?.[0] || 'U').toUpperCase()}
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800">{profile?.name || "उपयोगकर्ता"}</div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="pt-2 text-sm text-gray-600">
                खाता स्थिति: <span className="text-green-600 font-medium">सक्रिय</span>
              </div>
              {subscription && (
                <div className="pt-2 text-sm text-gray-600">
                  वर्तमान प्लान: <span className="font-medium text-blue-600">{subscription.plan_name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                व्याकरण सुधारक
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                अपने हिंदी पाठ को AI की शक्ति से तुरंत सुधारें और त्रुटिरहित बनाएं
              </p>
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>व्याकरण की त्रुटियां</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>वर्तनी की जांच</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>विराम चिह्न सुधार</span>
              </div>
              {subscription && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  आपकी सीमा: {subscription.max_words_per_correction} शब्द प्रति सुधार
                </div>
              )}
              <Link to="/grammar-checker" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                  व्याकरण सुधारक खोलें
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <span className="text-gray-600">आपका प्लान:</span>
            <span className="font-bold text-blue-600 text-lg">
              {subscription?.plan_name || 'लोड हो रहा है...'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">हिंदी लेखन को बेहतर बनाने के लिए यहां हैं</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
