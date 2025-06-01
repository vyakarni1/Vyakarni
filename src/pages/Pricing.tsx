
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Check, Star, Zap, Crown, Calculator } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWordCredits } from "@/hooks/useWordCredits";
import DiscountBadge from "@/components/DiscountBadge";
import CashfreePaymentButton from "@/components/Payment/CashfreePaymentButton";

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading } = useWordCredits();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गये!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

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

  const getDiscountInfo = (planType: string) => {
    switch (planType) {
      case 'basic':
        return { hasDiscount: true, percentage: 33, originalPrice: 1499 };
      case 'premium':
        return { hasDiscount: true, percentage: 23, originalPrice: 12999 };
      default:
        return { hasDiscount: false, percentage: 0, originalPrice: 0 };
    }
  };

  if (authLoading || plansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              व्याकरणी
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">डैशबोर्ड</Button>
              </Link>
              {user ? (
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  लॉग आउट
                </Button>
              ) : (
                <Link to="/login">
                  <Button>लॉग इन</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            शब्द पैकेज क्रय करयें
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            अपनी आवश्यकताओं के अनुसार शब्द पैकेज का चुनाव करयें
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Calculator className="h-4 w-4" />
            <span>सभी पैकेज 30 दिनों तक वैध • बचत ऑफर का लाभ उठायें</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
          {plans.map((plan) => {
            const discountInfo = getDiscountInfo(plan.plan_type);
            
            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.plan_type === 'basic' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
                }`}
              >
                {/* Discount Badge */}
                {discountInfo.hasDiscount && (
                  <DiscountBadge percentage={discountInfo.percentage} />
                )}

                {plan.plan_type === 'basic' && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    सबसे लोकप्रिय
                  </div>
                )}

                <CardHeader className={`text-center ${plan.plan_type === 'basic' ? 'pt-12' : 'pt-6'}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type)} text-white mb-4 mx-auto`}>
                    {getPlanIcon(plan.plan_type)}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {plan.words_included.toLocaleString('hi-IN')} शब्द
                    </div>
                    {plan.plan_type !== 'free' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          {discountInfo.hasDiscount && (
                            <span className="text-lg text-gray-500 line-through">
                              ₹{discountInfo.originalPrice.toLocaleString('hi-IN')}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{plan.price_before_gst.toLocaleString('hi-IN')}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          30 दिन की वैधता
                        </Badge>
                      </div>
                    )}
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
                      <span className="text-sm text-gray-700">तत्काल परिणाम</span>
                    </div>
                    {plan.plan_type !== 'free' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">समर्पित सहायता</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">विस्तृत रिपोर्ट</span>
                        </div>
                      </>
                    )}
                    {plan.plan_type === 'premium' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">एडवांस AI फीचर्स</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">विशेष भाषा सुधार सुझाव</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Payment Button */}
                  <div className="pt-4">
                    {plan.plan_type === 'free' ? (
                      <Button
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full bg-gray-600 hover:bg-gray-700"
                        disabled
                      >
                        साइनअप पर मिलता है
                      </Button>
                    ) : (
                      <CashfreePaymentButton 
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
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">आप शब्दों को किस प्रकार गिनते हैं?</h3>
              <p className="text-gray-600 text-sm">आपके द्वारा परीक्षण के लिये भेजे गये लेख में जितने शब्द होंगे, उतने ही शब्द आपके शेष शब्दों से काटे जायेंगे।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">शब्दों की वैधता अवधि क्या है?</h3>
              <p className="text-gray-600 text-sm">आपके द्वारा क्रय किये गये सभी शब्दों की वैधता अवधि 30 दिनों तक मान्य रहती है।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">क्या किये गये भुगतान सुरक्षित हैं?</h3>
              <p className="text-gray-600 text-sm">हम सुरक्षित एवं गहरी साख वाले पेमेंट गेटवे का प्रयोग करते हैं जो कि उच्च सुरक्षा मानकों का अनुपालन करते हैं। अतः, आपके द्वारा किये गये सभी भुगतान सुरक्षित हैं।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">आपकी रिफंड की नीति क्या है?</h3>
              <p className="text-gray-600 text-sm">आप हमारी डिजिटल सेवाओं का लाभ उठा रहे हैं। हमारी रिफंड नीति इसी के अनुरूप है। इस विषय में विस्तार से समझने हेतु आप इस लिंक पर क्लिक कर अधिक विवरण प्राप्त कर सकते हैं: https://vyakarni.com/refund-policy।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
