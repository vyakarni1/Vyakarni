import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Calculator, User } from "lucide-react";
import { toast } from "sonner";
import { useWordCredits } from "@/hooks/useWordCredits";
import DiscountBadge from "@/components/DiscountBadge";
import PaymentGatewaySelector from "@/components/Payment/PaymentGatewaySelector";
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
    getWordCreditPlans,
    getDiscountInfo
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
  const getPlanIcon = (planType: string) => {
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
  const getPlanColor = (planType: string) => {
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
  if (authLoading || plansLoading) {
    return <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>;
  }
  const wordCreditPlans = getWordCreditPlans();
  return <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 my-[12px] py-[8px]">
              शब्द क्रेडिट खरीदें
            </h1>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-5 my-[12px] py-[8px]">
              सुनहरे आरंभिक ऑफर का लाभ उठायें!
            </h2>
            <p className="text-xl text-gray-600 mb-4">एक बार खरीदें और 120 दिनों तक निर्बाध उपयोग करें</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Calculator className="h-4 w-4" />
              <span>तत्काल सुलभ प्रयोग • उच्च गुणवत्ता परिणाम • त्वरित प्रगति अनुगमन</span>
            </div>
          </div>

          {/* Word Credit Plans */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
              {wordCreditPlans.map(plan => {
              const discountInfo = getDiscountInfo(plan.plan_type);
              const totalPrice = plan.price_before_gst + plan.price_before_gst * plan.gst_percentage / 100;
              return <Card key={plan.id} className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${plan.plan_type === 'basic' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}>
                    {/* Discount Badge */}
                    {discountInfo.hasDiscount && <DiscountBadge percentage={discountInfo.percentage} />}

                    {plan.plan_type === 'basic' && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                        सबसे लोकप्रिय
                      </div>}

                    <CardHeader className={`text-center ${plan.plan_type === 'basic' ? 'pt-12' : 'pt-6'}`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type)} text-white mb-4 mx-auto`}>
                        {getPlanIcon(plan.plan_type)}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                      
                      {/* Word Credits Display */}
                      <div className="text-center mb-2">
                        <div className="text-lg font-semibold text-blue-600">
                          {plan.words_included.toLocaleString()} शब्द
                        </div>
                        <div className="text-xs text-gray-500">
                          स्थायी एक्सेस • कोई समाप्ति नहीं
                        </div>
                      </div>

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
                              एक बार भुगतान | 18% GST अतिरिक्त
                            </Badge>
                            <div className="text-xs text-gray-600">
                              कुल: ₹{totalPrice.toFixed(0)}
                            </div>
                          </div> : <div className="text-2xl font-bold text-green-600">निःशुल्क</div>}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Dynamic Features */}
                      <div className="space-y-3">
                        {plan.features && plan.features.length > 0 ? plan.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>) :
                    // Fallback features
                    <>
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
                              <span className="text-sm text-gray-700">स्थायी एक्सेस</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">तत्काल परिणाम</span>
                            </div>
                            {plan.plan_type !== 'free' && <>
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
                          </>}
                      </div>

                      {/* Payment Button */}
                      <div className="pt-4">
                        <PaymentGatewaySelector wordPlan={plan} onPaymentSuccess={() => {
                      toast.success("भुगतान सफल! शब्द क्रेडिट आपके खाते में जोड़ दिए गए हैं।");
                      navigate("/billing");
                    }} />
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>
          </div>

          {/* Enterprise Plan Section */}
          <EnterprisePlanSection />

          {/* FAQ Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">प्रायः पूछे जाने वाले प्रश्न</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">शब्द-सीमा कितने दिनों के लिये वैध होती है?</h3>
                <p className="text-gray-600 text-sm">हमारी नवीनतम नीतियों के अनुसार शब्द-सीमा 120 दिनों (चार माह) के लिये वैध है। यद्यपि यह अवधि कंपनी के दिशा-निर्देशों के अनुरूप परिवर्तनीय है।</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">क्या प्रति माह शब्द प्रयोग के कुछ बंधन हैं?</h3>
                <p className="text-gray-600 text-sm">जी नही, प्रति माह शब्द प्रयोग का कोई बंधन नहीं है। आप 180 दिनों के मध्य कभी भी अपने शब्दों का प्रयोग कर सकते हैं। एक बार यह अवधि पूर्ण होने पर शेष शब्द स्वतः समाप्त हो जाते हैं।</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">आप पेमेंट की किन विधियों को स्वीकार करते हैं?</h3>
                <p className="text-gray-600 text-sm">हमारे पेमेंट गेटवे साझीदार विभिन्न प्रकार की पेमेंट विधियों को स्वीकार करते हैं। </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">शब्द कैसे काउंट होते हैं?</h3>
                <p className="text-gray-600 text-sm">हर व्याकरण जाँच के लिये आपके टेक्स्ट के शब्दों की संख्या के बराबर शब्द क्रेडिट कटते हैं।</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Pricing;