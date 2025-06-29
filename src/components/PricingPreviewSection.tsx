
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star, Crown, Calculator, Plus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DiscountBadge from './DiscountBadge';
import { useWordCredits } from '@/hooks/useWordCredits';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';

const PricingPreviewSection = () => {
  const { plans, loading } = useWordCredits();
  const { user } = useAuth();
  const [canPurchaseTopup, setCanPurchaseTopup] = useState(false);

  // Check topup eligibility on component mount
  useEffect(() => {
    const checkTopupEligibility = async () => {
      if (user) {
        const { canPurchaseTopup: canUseTopup } = useWordCredits();
        const result = await canUseTopup();
        setCanPurchaseTopup(result);
      }
    };
    
    checkTopupEligibility();
  }, [user]);

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

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">मासिक सब्स्क्रिप्शन + वर्ड टॉप-अप</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              पहले सब्स्क्रिप्शन चुनें, फिर आवश्यकता अनुसार वर्ड टॉप-अप करें।
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  const subscriptionPlans = plans.filter(plan => plan.plan_category === 'subscription');
  const topupPlans = plans.filter(plan => plan.plan_category === 'topup');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">मासिक सब्स्क्रिप्शन + वर्ड टॉप-अप</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            पहले सब्स्क्रिप्शन चुनें, फिर आवश्यकता अनुसार वर्ड टॉप-अप करें।
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Calculator className="h-4 w-4" />
            <span>मासिक बिलिंग • असीमित टॉप-अप सुविधा • कभी भी रद्द करें</span>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">मासिक सब्स्क्रिप्शन प्लान</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
            {subscriptionPlans.map((plan, index) => {
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

                  {/* Popular Badge */}
                  {plan.plan_type === 'basic' && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                      सबसे लोकप्रिय
                    </div>
                  )}

                  <CardHeader className={`text-center ${plan.plan_type === 'basic' ? 'pt-12' : 'pt-6'}`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type, plan.plan_category)} text-white mb-4 mx-auto`}>
                      {getPlanIcon(plan.plan_type, plan.plan_category)}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                    <div className="space-y-2">
                      {plan.plan_type !== 'free' ? (
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
                            प्रति माह | 18% GST अतिरिक्त
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-600">निःशुल्क</div>
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
                        <span className="text-sm text-gray-700">वर्ड टॉप-अप सुविधा</span>
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
                            <span className="text-sm text-gray-700">प्राथमिकता सपोर्ट</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Button */}
                    <div className="pt-4">
                      {plan.plan_type === 'free' ? (
                        <Button 
                          className="w-full bg-gray-600 hover:bg-gray-700" 
                          disabled
                        >
                          साइनअप पर मिलता है
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-300"
                          asChild
                        >
                          <Link to={user ? "/pricing" : "/register"}>
                            {user ? "सब्स्क्राइब करें" : "साइनअप करें"}
                          </Link>
                        </Button>
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
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">वर्ड टॉप-अप</h3>
            <p className="text-center text-gray-600 mb-8">
              सब्स्क्रिप्शन के साथ अतिरिक्त शब्द खरीदें
            </p>
            
            <div className="max-w-2xl mx-auto">
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
                      {!user ? (
                        <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                          <Link to="/register">पहले साइनअप करें</Link>
                        </Button>
                      ) : !canPurchaseTopup ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 p-3 bg-orange-100 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <p className="text-sm text-orange-800">
                              टॉप-अप खरीदने के लिए पहले कोई सब्स्क्रिप्शन प्लान लें
                            </p>
                          </div>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                            <Link to="/pricing">सब्स्क्रिप्शन चुनें</Link>
                          </Button>
                        </div>
                      ) : (
                        <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                          <Link to="/pricing">टॉप-अप खरीदें</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
              सभी विकल्प देखें
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreviewSection;
