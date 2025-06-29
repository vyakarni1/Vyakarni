
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
import { TrendingUp, CreditCard, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Billing = () => {
  const { user, loading: authLoading } = useAuth();
  const { balance, loading: balanceLoading, fetchBalance } = useWordCredits();
  const { subscription, refetch: refetchSubscription, loading: subscriptionLoading } = useSubscription();
  const { lastUpdate } = useRealtimeSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if this is a payment success redirect
  const paymentStatus = searchParams.get('payment');

  // Refresh data when payment is successful or when realtime updates occur
  useEffect(() => {
    if (paymentStatus === 'success') {
      const refreshData = async () => {
        console.log('Payment success detected, refreshing billing data...');
        await fetchBalance();
        await refetchSubscription();
        toast.success('भुगतान सफल! आपका डेटा अपडेट हो गया है।');
      };
      
      // Add delay to ensure database updates are complete
      const timer = setTimeout(refreshData, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, fetchBalance, refetchSubscription]);

  // Refresh data when realtime updates are detected
  useEffect(() => {
    const refreshData = async () => {
      console.log('Realtime update detected, refreshing billing data...');
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

  if (authLoading || balanceLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">बिलिंग डेटा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  // Manual refresh function for debugging
  const handleManualRefresh = async () => {
    toast.info('डेटा अपडेट हो रहा है...');
    await Promise.all([fetchBalance(), refetchSubscription()]);
    toast.success('डेटा अपडेट हो गया!');
  };

  // Get subscription status for display
  const getSubscriptionStatusText = () => {
    if (!subscription) return 'कोई प्लान नहीं';
    
    if (balance.purchased_words > 0) {
      if (subscription.plan_type === 'free') {
        return balance.purchased_words >= 25000 ? 'प्रीमियम (खरीदा गया)' : 'बेसिक (खरीदा गया)';
      }
    }
    
    switch (subscription.plan_type) {
      case 'premium': return 'प्रीमियम';
      case 'basic': return 'बेसिक';
      case 'free': return 'मुफ्त';
      default: return subscription.plan_name;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavigation />
      
      <div className="pt-20 container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">बिलिंग और उपयोग</h1>
            <p className="text-gray-600">अपने खाते की जानकारी, शब्द उपयोग और भुगतान विवरण देखें</p>
          </div>
          <Button onClick={handleManualRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            रिफ्रेश करें
          </Button>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">कुल शब्द</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {balance.total_words_available.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    खरीदे गए: {balance.purchased_words.toLocaleString()}
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
                  <p className="text-xs text-gray-500 mt-1">
                    मुफ्त: {balance.free_words.toLocaleString()}
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
                    {getSubscriptionStatusText()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    स्थिति: {subscription?.status || 'अज्ञात'}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Information (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Information</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>Subscription Plan Type: {subscription?.plan_type || 'None'}</p>
                <p>Subscription Status: {subscription?.status || 'None'}</p>
                <p>Has Active Subscription: {balance.has_active_subscription ? 'Yes' : 'No'}</p>
                <p>Purchased Words: {balance.purchased_words}</p>
                <p>Last Update: {new Date(lastUpdate).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

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
