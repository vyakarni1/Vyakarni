
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useSubscription } from "@/hooks/useSubscription";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import WordCreditsOverview from "@/components/Billing/WordCreditsOverview";
import BillingHistory from "@/components/Billing/BillingHistory";
import UsageAnalytics from "@/components/Billing/UsageAnalytics";
import CurrentPlan from "@/components/Billing/CurrentPlan";
import PaymentSuccessHandler from "@/components/Payment/PaymentSuccessHandler";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CreditCard, FileText } from "lucide-react";

const Billing = () => {
  const { user, loading: authLoading } = useAuth();
  const { balance, loading: balanceLoading, fetchBalance } = useWordCredits();
  const { refetch: refetchSubscription } = useSubscription();
  const { lastUpdate } = useRealtimeSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if this is a payment success redirect
  const paymentStatus = searchParams.get('payment');

  // Refresh data when payment is successful or when realtime updates occur
  useEffect(() => {
    if (paymentStatus === 'success') {
      const refreshData = async () => {
        await fetchBalance();
        await refetchSubscription();
      };
      
      // Add delay to ensure database updates are complete
      const timer = setTimeout(refreshData, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, fetchBalance, refetchSubscription]);

  // Refresh data when realtime updates are detected
  useEffect(() => {
    const refreshData = async () => {
      console.log('Realtime update detected, refreshing data...');
      await Promise.all([fetchBalance(), refetchSubscription()]);
    };

    if (lastUpdate > 0) {
      refreshData();
    }
  }, [lastUpdate, fetchBalance, refetchSubscription]);

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
      <UnifiedNavigation />
      
      <div className="pt-20 container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">बिलिंग और उपयोग</h1>
          <p className="text-gray-600">अपने खाते की जानकारी, शब्द उपयोग और भुगतान विवरण देखें</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">कुल शब्द</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {balance.total_words_available.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">खरीदे गए शब्द</p>
                  <p className="text-2xl font-bold text-green-600">
                    {balance.purchased_words.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">प्लान स्थिति</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {balance.has_active_subscription ? 'सक्रिय' : 'बेसिक'}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
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
