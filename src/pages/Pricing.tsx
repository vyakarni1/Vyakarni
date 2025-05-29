
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Check, Star, Zap, Crown, Calculator } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useWordCredits } from "@/hooks/useWordCredits";

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const { plans, loading: plansLoading, addWordCredits } = useWordCredits();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  const calculateGSTPrice = (basePrice: number, gstPercentage: number) => {
    const gstAmount = (basePrice * gstPercentage) / 100;
    return {
      basePrice,
      gstAmount,
      totalPrice: basePrice + gstAmount
    };
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

    // For now, simulate successful purchase - we'll implement Razorpay later
    const success = await addWordCredits(plan.plan_type, plan.words_included);
    
    if (success) {
      toast.success(`${plan.words_included} शब्द सफलतापूर्वक जोड़े गए!`);
    } else {
      toast.error("खरीदारी में समस्या हुई");
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
            शब्द पैकेज खरीदें
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            अपनी आवश्यकताओं के अनुसार शब्द पैकेज चुनें
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Calculator className="h-4 w-4" />
            <span>सभी पैकेज 30 दिन तक वैध • 18% GST अतिरिक्त</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const pricing = calculateGSTPrice(plan.price_before_gst, plan.gst_percentage);
            
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.plan_type === 'basic' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
                }`}
              >
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
                          <span className="text-2xl font-bold text-gray-900">
                            ₹{pricing.totalPrice.toLocaleString('hi-IN')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div>बेस प्राइस: ₹{pricing.basePrice.toLocaleString('hi-IN')}</div>
                          <div>GST (18%): ₹{pricing.gstAmount.toLocaleString('hi-IN')}</div>
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
                      <span className="text-sm text-gray-700">हिंदी व्याकरण जांच</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">स्टाइल एन्हांसमेंट</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">तत्काल परिणाम</span>
                    </div>
                    {plan.plan_type !== 'free' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">प्राथमिकता सपोर्ट</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">विस्तृत रिपोर्ट</span>
                        </div>
                      </>
                    )}
                    {plan.plan_type === 'premium' && (
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">एडवांस AI फीचर्स</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full mt-6 ${
                      plan.plan_type === 'basic'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : plan.plan_type === 'premium'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    disabled={plan.plan_type === 'free'}
                  >
                    {plan.plan_type === 'free' ? 'साइनअप पर मिलता है' : 'अभी खरीदें'}
                  </Button>
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
              <h3 className="font-semibold text-gray-800 mb-2">शब्द कैसे गिने जाते हैं?</h3>
              <p className="text-gray-600 text-sm">आपके द्वारा जांच के लिए भेजे गए टेक्स्ट में जितने शब्द होंगे, उतने ही आपके बैलेंस से काटे जाएंगे।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">शब्द की वैधता कितनी है?</h3>
              <p className="text-gray-600 text-sm">खरीदे गए सभी शब्द खरीदारी की तारीख से 30 दिन तक वैध रहते हैं।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">GST कैसे लगती है?</h3>
              <p className="text-gray-600 text-sm">सभी पैकेज पर 18% GST लगती है जो चेकआउट के समय जोड़ी जाती है।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">रिफंड की नीति क्या है?</h3>
              <p className="text-gray-600 text-sm">तकनीकी समस्या की स्थिति में 7 दिन के अंदर रिफंड की सुविधा उपलब्ध है।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
