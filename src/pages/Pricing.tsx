import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Calculator, Plus, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useWordCredits } from "@/hooks/useWordCredits";
import DiscountBadge from "@/components/DiscountBadge";
import PaymentGatewaySelector from "@/components/Payment/PaymentGatewaySelector";
import RecurringSubscriptionButton from "@/components/Payment/RecurringSubscriptionButton";
import EnterprisePlanSection from "@/components/EnterprisePlanSection";
import Layout from "@/components/Layout";
const Pricing = () => {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    plans,
    loading: plansLoading,
    getSubscriptionPlans,
    getTopupPlans,
    canPurchaseTopup
  } = useWordCredits();
  const navigate = useNavigate();
  const handleSelectPlan = async (plan: any) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (plan.plan_type === 'free') {
      toast.info("फ्री प्लान पहले से ही मिल चुका है!");
      return;
    }
  };
  const getPlanIcon = (planType: string, planCategory: string) => {
    if (planCategory === 'topup') return <Plus className="h-6 w-6" />;
    switch (planType) {
      case 'free':
        return <Zap className="h-6 w-6" />;
      case 'basic':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };
  const getPlanColor = (planType: string, planCategory: string) => {
    if (planCategory === 'topup') return 'from-purple-500 to-purple-600';
    switch (planType) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'basic':
        return 'from-blue-500 to-purple-600';
      case 'premium':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };
  const getDiscountInfo = (planType: string) => {
    switch (planType) {
      case 'basic':
        return {
          hasDiscount: true,
          percentage: 33,
          originalPrice: 1499
        };
      case 'premium':
        return {
          hasDiscount: true,
          percentage: 23,
          originalPrice: 12999
        };
      default:
        return {
          hasDiscount: false,
          percentage: 0,
          originalPrice: 0
        };
    }
  };
  if (authLoading || plansLoading) {
    return <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>;
  }
  const subscriptionPlans = getSubscriptionPlans();
  const topupPlans = getTopupPlans();
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 my-[12px] py-[8px]">
              मासिक सब्स्क्रिप्शन प्लान
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              AutoPay के साथ मासिक सब्स्क्रिप्शन लें - अब कभी भुगतान भूलने की चिंता नहीं
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <RefreshCw className="h-4 w-4" />
              <span>AutoPay सक्रिय • मासिक बिलिंग • असीमित टॉप-अप सुविधा</span>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">AutoPay सब्स्क्रिप्शन</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
              {subscriptionPlans.map(plan => {
              const discountInfo = getDiscountInfo(plan.plan_type);
              return <Card key={plan.id} className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${plan.plan_type === 'basic' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}>
                    {/* Discount Badge */}
                    {discountInfo.hasDiscount && <DiscountBadge percentage={discountInfo.percentage} />}

                    {plan.plan_type === 'basic' && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                        सबसे लोकप्रिय
                      </div>}

                    <CardHeader className={`text-center ${plan.plan_type === 'basic' ? 'pt-12' : 'pt-6'}`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type, plan.plan_category)} text-white mb-4 mx-auto`}>
                        {getPlanIcon(plan.plan_type, plan.plan_category)}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                      <div className="space-y-2">
                        {plan.plan_type !== 'free' ? <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-2">
                              {discountInfo.hasDiscount && <span className="text-lg text-gray-500 line-through">
                                  ₹{discountInfo.originalPrice.toLocaleString('hi-IN')}
                                </span>}
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{plan.price_before_gst.toLocaleString('hi-IN')}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              प्रति माह | 18% GST अतिरिक्त
                            </Badge>
                            <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                              <RefreshCw className="h-3 w-3" />
                              <span>AutoPay सक्रिय</span>
                            </div>
                          </div> : <div className="text-2xl font-bold text-green-600">निःशुल्क</div>}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">हिंदी व्याकरण जाँच</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">एक-क्लिक वाक्य सुधार</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">वर्ड टॉप-अप सुविधा</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">तत्काल परिणाम</span>
                        </div>
                        {plan.plan_type !== 'free' && <>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">AutoPay सुविधा</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">समर्पित सहायता</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">विस्तृत रिपोर्ट</span>
                            </div>
                          </>}
                        {plan.plan_type === 'premium' && <>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">एडवांस AI फीचर्स</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">प्राथमिकता सपोर्ट</span>
                            </div>
                          </>}
                      </div>

                      {/* Payment Button */}
                      <div className="pt-4">
                        {plan.plan_type === 'free' ? <Button onClick={() => handleSelectPlan(plan)} className="w-full bg-gray-600 hover:bg-gray-700" disabled>
                            साइनअप पर मिलता है
                          </Button> : <RecurringSubscriptionButton wordPlan={plan} onSubscriptionSuccess={() => {
                      toast.success("AutoPay सब्स्क्रिप्शन सफल! मासिक बिलिंग सक्रिय हो गई है।");
                      navigate("/billing");
                    }} />}
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>

          {/* Top-up Plans */}
          {topupPlans.length > 0 && <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">वर्ड टॉप-अप</h2>
              <p className="text-center text-gray-600 mb-8">
                सब्स्क्रिप्शन के साथ अतिरिक्त शब्द खरीदें
              </p>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {topupPlans.map(plan => <Card key={plan.id} className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <Plus className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{plan.plan_name}</h4>
                            <p className="text-gray-600">{plan.words_included.toLocaleString('hi-IN')} अतिरिक्त शब्द</p>
                            <p className="text-sm text-purple-600">30 दिन की वैधता</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{plan.price_before_gst.toLocaleString('hi-IN')}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            18% GST अतिरिक्त
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {!user ? <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                            <Link to="/register">पहले साइनअप करें</Link>
                          </Button> : !canPurchaseTopup() ? <div className="space-y-3">
                            <div className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <p className="text-sm text-orange-800">
                                टॉप-अप खरीदने के लिए पहले कोई सब्स्क्रिप्शन प्लान लें
                              </p>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                              पहले सब्स्क्रिप्शन लें
                            </Button>
                          </div> : <PaymentGatewaySelector wordPlan={plan} onPaymentSuccess={() => {
                    toast.success("भुगतान सफल! शब्द आपके खाते में जोड़ दिये गये हैं।");
                    navigate("/billing");
                  }} />}
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>}

          {/* Enterprise Plan Section */}
          <EnterprisePlanSection />

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">प्रायः पूछे जाने वाले प्रश्न</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">AutoPay कैसे काम करता है?</h3>
                <p className="text-gray-600 text-sm">AutoPay को एक बार सेटअप करने के उपरांत प्रत्येक माह स्वतः भुगतान होता रहता है। आपको मैन्युअल रूप से भुगतान करने की आवश्यकता  नहीं पड़ती है।</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">क्या मैं AutoPay निरस्त कर सकता हूँ?</h3>
                <p className="text-gray-600 text-sm">जी हाँ, आप किसी भी समय AutoPay mandate को निरस्त कर सकते हैं। यह अगले बिलिंग साइकल से बंद हो जाएगा।</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">वर्ड टॉप-अप क्या है?</h3>
                <p className="text-gray-600 text-sm">
                  यह अतिरिक्त शब्द हैं जो आप अपने सब्स्क्रिप्शन के साथ खरीद सकते हैं। ये 30 दिनों तक वैध रहते हैं।
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">AutoPay सुरक्षित है?</h3>
                <p className="text-gray-600 text-sm">
                  हां, Razorpay का AutoPay RBI द्वारा अनुमोदित e-NACH/UPI mandate का उपयोग करता है। यह पूर्णतः सुरक्षित है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Pricing;