
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import WordCreditsOverview from "@/components/Billing/WordCreditsOverview";
import BillingHistory from "@/components/Billing/BillingHistory";
import UsageAnalytics from "@/components/Billing/UsageAnalytics";
import CurrentPlan from "@/components/Billing/CurrentPlan";
import PaymentSuccessHandler from "@/components/Payment/PaymentSuccessHandler";
import UnifiedNavigation from "@/components/UnifiedNavigation";

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
      <UnifiedNavigation />
      
      <div className="pt-20 container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">बिलिंग और उपयोग</h1>
          <p className="text-gray-600">अपने खाते की जानकारी, शब्द उपयोग और भुगतान इतिहास देखें</p>
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
