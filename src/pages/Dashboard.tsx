
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import WordUsageStatsCards from "@/components/WordUsageStatsCards";
import WordBalanceCard from "@/components/WordBalanceCard";
import WordUsageCard from "@/components/WordUsageCard";
import SmartRecommendationsCard from "@/components/SmartRecommendationsCard";
import Footer from "@/components/Footer";
import { useWordCredits } from "@/hooks/useWordCredits";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import DashboardWelcome from "@/components/Dashboard/DashboardWelcome";
import DashboardActionCards from "@/components/Dashboard/DashboardActionCards";
import DashboardFooterStats from "@/components/Dashboard/DashboardFooterStats";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const { balance } = useWordCredits();

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
      <UnifiedNavigation variant="default" />

      <div className="container mx-auto px-6 py-8 pt-24">
        <DashboardWelcome 
          profile={profile} 
          userEmail={user.email || ''} 
          balance={balance.total_words_available} 
        />

        {/* Word Balance and Usage Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <WordBalanceCard />
          <WordUsageCard />
          <SmartRecommendationsCard />
        </div>

        {/* Real-time Word Usage Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            📊 विस्तृत शब्द उपयोग की जानकारी
          </h2>
          <WordUsageStatsCards />
        </div>

        <DashboardActionCards 
          profile={profile} 
          userEmail={user.email || ''} 
          balance={balance.total_words_available} 
        />

        <DashboardFooterStats balance={balance.total_words_available} />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
