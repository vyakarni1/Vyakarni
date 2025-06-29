
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
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
        toast.success('भुगतान सफल! आपका डेटा अपडेट हो गया है।');
      };
      
      // Add delay to ensure database updates are complete
      const timer = setTimeout(refreshData, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, fetchBalance]);

  // Refresh data when realtime updates are detected
  useEffect(() => {
    const refreshData = async () => {
      console.log('Realtime update detected, refreshing billing data...');
      await fetchBalance();
    };

    if (lastUpdate > 0) {
      refreshData();
    }
  }, [lastUpdate, fetchBalance]);

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
    await fetchBalance();
    toast.success('डेटा अपडेट हो गया!');
  };

  // Simple word credit tier determination
  const getWordCreditTier = () => {
    if (balance.purchased_words >= 25000) {
      return 'प्रोफेशनल';
    } else if (balance.purchased_words >= 5000) {
      return 'हॉबी';
    } else {
      return 'मुफ्त';
    }
  };

  // Get simple status text
  const getSimpleStatusText = () => {
    if (balance.purchased_words > 0 && balance.free_words > 0) {
      return `${balance.total_words_available.toLocaleString()} शब्द उपलब्ध`;
    } else if (balance.purchased_words > 0) {
      return `${balance.purchased_words.toLocaleString()} खरीदे गए शब्द`;
    } else {
      return `${balance.free_words.toLocaleString()} मुफ्त शब्द`;
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
                    उपलब्ध शब्द
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
                    स्थायी रूप से उपलब्ध
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
                  <p className="text-sm font-medium text-gray-600">शब्द क्रेडिट टियर</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {getWordCreditTier()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getSimpleStatusText()}
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
