
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BillingHistory from "@/components/Billing/BillingHistory";
import UsageAnalytics from "@/components/Billing/UsageAnalytics";
import CurrentPlan from "@/components/Billing/CurrentPlan";
import WordCreditsOverview from "@/components/Billing/WordCreditsOverview";
import { ArrowLeft, CreditCard, BarChart3, History, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Billing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
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
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              डैशबोर्ड पर वापस जाएं
            </Button>
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">बिलिंग और उपयोग</h1>
          </div>
          <p className="text-gray-600">अपने खाते की जानकारी और उपयोग का विवरण देखें</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Coins className="h-4 w-4" />
              <span>ओवरव्यू</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>एनालिटिक्स</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>हिस्ट्री</span>
            </TabsTrigger>
            <TabsTrigger value="plan" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>प्लान</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <WordCreditsOverview />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <UsageAnalytics />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <BillingHistory />
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <CurrentPlan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
