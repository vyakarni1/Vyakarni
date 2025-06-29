
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Users, Calculator, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useWordCredits } from "@/hooks/useWordCredits";
import DiscountBadge from "@/components/DiscountBadge";
import PaymentGatewaySelector from "@/components/Payment/PaymentGatewaySelector";
import EnterprisePlanSection from "@/components/EnterprisePlanSection";
import Layout from "@/components/Layout";

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading, getSubscriptionPlans, getTopupPlans, canPurchaseTopup } = useWordCredits();
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
      case 'starter':
        return <Star className="h-6 w-6" />;
      case 'pro':
        return <Crown className="h-6 w-6" />;
      case 'elite':
        return <Crown className="h-6 w-6" />;
      case 'enterprise':
        return <Users className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planType: string, planCategory: string) => {
    if (planCategory === 'topup') return 'from-purple-500 to-purple-600';
    
    switch (planType) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'starter':
        return 'from-blue-500 to-blue-600';
      case 'pro':
        return 'from-purple-500 to-purple-600';
      case 'elite':
        return 'from-purple-600 to-pink-600';
      case 'enterprise':
        return 'from-gray-800 to-gray-900';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getDiscountInfo = (planType: string) => {
    switch (planType) {
      case 'starter':
        return {
          hasDiscount: true,
          percentage: 25,
          originalPrice: 399
        };
      case 'pro':
        return {
          hasDiscount: true,
          percentage: 20,
          originalPrice: 749
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
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const subscriptionPlans = getSubscriptionPlans();
  const topupPlans = getTopupPlans();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 my-[12px] py-[8px]">
              5-स्तरीय सब्स्क्रिप्शन प्लान
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              मासिक सब्स्क्रिप्शन लें और 120-दिन वैधता के टॉप-अप की सुविधा पाएं
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Calculator className="h-4 w-4" />
              <span>मासिक बिलिंग • 120-दिन टॉप-अप वैधता • कभी भी रद्द करें</span>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">मासिक सब्स्क्रिप्शन</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto p-6">
              {subscriptionPlans.map((plan) => {
                const discountInfo = getDiscountInfo(plan.plan_type);
                const isPopular = plan.plan_type === 'starter';
                
                return (
                  <Card 
                    key={plan.id} 
                    className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                      isPopular ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
                    }`}
                  >
                    {/* Discount Badge */}
                    {discountInfo.hasDiscount && (
                      <DiscountBadge percentage={discountInfo.percentage} />
                    )}

                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                        सबसे लोकप्रिय
                      </div>
                    )}

                    <CardHeader className={`text-center ${isPopular ? 'pt-12' : 'pt-6'}`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type, plan.plan_category)} text-white mb-4 mx-auto`}>
                        {getPlanIcon(plan.plan_type, plan.plan_category)}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                      <div className="space-y-2">
                        {plan.plan_type !== 'free' ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-center space-x-2">
                              {discountInfo.hasDiscount && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{discountInfo.originalPrice.toLocaleString('hi-IN')}
                                </span>
                              )}
                              <span className="text-xl font-bold text-gray-900">
                                ₹{plan.price_before_gst.toLocaleString('hi-IN')}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              प्रति माह | 18% GST अतिरिक्त
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-green-600">निःशुल्क</div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Features */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700">हिंदी व्याकरण जाँच</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700">एक-क्लिक वाक्य सुधार</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700">वर्ड टॉप-अप सुविधा</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700">तत्काल परिणाम</span>
                        </div>
                        {plan.plan_type !== 'free' && (
                          <>
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-gray-700">समर्पित सहायता</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-gray-700">विस्तृत रिपोर्ट</span>
                            </div>
                          </>
                        )}
                        {plan.plan_type === 'elite' && (
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-700">API एक्सेस</span>
                          </div>
                        )}
                        {plan.plan_type === 'enterprise' && (
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-700">कस्टम इंटीग्रेशन</span>
                          </div>
                        )}
                      </div>

                      {/* Payment Button */}
                      <div className="pt-4">
                        {plan.plan_type === 'free' ? (
                          <Button 
                            onClick={() => handleSelectPlan(plan)} 
                            className="w-full bg-gray-600 hover:bg-gray-700" 
                            disabled
                            size="sm"
                          >
                            साइनअप पर मिलता है
                          </Button>
                        ) : (
                          <PaymentGatewaySelector 
                            wordPlan={plan} 
                            onPaymentSuccess={() => {
                              toast.success("भुगतान सफल! सब्स्क्रिप्शन सक्रिय कर दिया गया है।");
                              navigate("/billing");
                            }} 
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Top-up Plans */}
          {topupPlans.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">वर्ड टॉप-अप (120 दिन वैधता)</h2>
              <p className="text-center text-gray-600 mb-8">
                सब्स्क्रिप्शन के साथ अतिरिक्त शब्द खरीदें - अब 120 दिन की लंबी वैधता के साथ!
              </p>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {topupPlans.map((plan) => (
                  <Card key={plan.id} className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <Plus className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">{plan.plan_name}</h4>
                            <p className="text-gray-600">{plan.words_included.toLocaleString('hi-IN')} अतिरिक्त शब्द</p>
                            <p className="text-sm text-purple-600 font-medium">120 दिन की वैधता</p>
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
                        {!user ? (
                          <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                            <Link to="/register">पहले साइनअप करें</Link>
                          </Button>
                        ) : !canPurchaseTopup() ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <p className="text-sm text-orange-800">
                                टॉप-अप खरीदने के लिए पहले कोई सब्स्क्रिप्शन प्लान लें
                              </p>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                              पहले सब्स्क्रिप्शन लें
                            </Button>
                          </div>
                        ) : (
                          <PaymentGatewaySelector 
                            wordPlan={plan} 
                            onPaymentSuccess={() => {
                              toast.success("भुगतान सफल! शब्द आपके खाते में जोड़ दिये गये हैं।");
                              navigate("/billing");
                            }} 
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Enterprise Plan Section */}
          <EnterprisePlanSection />

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">प्रायः पूछे जाने वाले प्रश्न</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">5-स्तरीय सिस्टम कैसे काम करता है?</h3>
                <p className="text-gray-600 text-sm">
                  फ्री, स्टार्टर, प्रो, एलीट और एंटरप्राइज़ - हर जरूरत के लिए एक प्लान। सब्स्क्रिप्शन के साथ टॉप-अप भी खरीद सकते हैं।
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">टॉप-अप की वैधता कितनी है?</h3>
                <p className="text-gray-600 text-sm">
                  अब टॉप-अप की वैधता 120 दिन है, पहले से 4 गुना ज्यादा! आराम से अपने शब्दों का उपयोग करें।
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">क्या मैं कभी भी सब्स्क्रिप्शन रद्द कर सकता हूं?</h3>
                <p className="text-gray-600 text-sm">
                  हां, आप किसी भी समय अपना सब्स्क्रिप्शन रद्द कर सकते हैं। वर्तमान महीने का एक्सेस बना रहेगा।
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">टॉप-अप कब खरीद सकते हैं?</h3>
                <p className="text-gray-600 text-sm">
                  केवल एक्टिव सब्स्क्रिप्शन (स्टार्टर से एंटरप्राइज़) वाले यूजर्स ही वर्ड टॉप-अप खरीद सकते हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
