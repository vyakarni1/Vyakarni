
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Calendar, Download, BarChart3, Settings } from "lucide-react";
import { useWordCredits } from "@/hooks/useWordCredits";
import WordCreditsOverview from "@/components/Billing/WordCreditsOverview";
import BillingHistory from "@/components/Billing/BillingHistory";
import UsageAnalytics from "@/components/Billing/UsageAnalytics";
import CurrentPlan from "@/components/Billing/CurrentPlan";
import RecurringSubscriptionInfo from "@/components/Billing/RecurringSubscriptionInfo";
import PaymentSuccessHandler from "@/components/Payment/PaymentSuccessHandler";

const Billing = () => {
  const { user, loading: authLoading } = useAuth();
  const { balance, loading: balanceLoading } = useWordCredits();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if this is a payment success redirect
  const paymentStatus = searchParams.get('payment');

  if (!authLoading && !user) {
    navigate("/login");
    return null;
  }

  // Show payment success handler if it's a payment success redirect
  if (paymentStatus === 'success') {
    return <PaymentSuccessHandler />;
  }

  if (authLoading || balanceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  डैशबोर्ड
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">बिलिंग और उपयोग</h1>
          <p className="text-gray-600">अपने खाते की जानकारी, शब्द उपयोग और भुगतान इतिहास देखें</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">खाता स्थिति</p>
                  <p className="text-lg font-semibold text-green-600">सक्रिय</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Word Credits Overview */}
            <WordCreditsOverview />
            
            {/* Usage Analytics */}
            <UsageAnalytics />
          </div>

          <div className="space-y-6">
            {/* Current Plan */}
            <CurrentPlan />
            
            {/* Recurring Subscription Info */}
            <RecurringSubscriptionInfo />
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>त्वरित कार्यवाही</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/pricing" className="block">
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    अधिक शब्द खरीदें
                  </Button>
                </Link>
                <Link to="/subscription-management" className="block">
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    सब्स्क्रिप्शन प्रबंधित करें
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  बिल डाउनलोड करें
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-8">
          <BillingHistory />
        </div>
      </div>
    </div>
  );
};

export default Billing;
