
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star, Crown, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DiscountBadge from './DiscountBadge';
import { useWordCredits } from '@/hooks/useWordCredits';
import { useAuth } from '@/components/AuthProvider';

const PricingPreviewSection = () => {
  const { plans, loading } = useWordCredits();
  const { user } = useAuth();

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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">सभी के लिये उपयुक्त प्लान</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              अपनी आवश्यकताओं के अनुसार सबसे बढ़िया प्लान चुनें और आज ही आरम्भ करें।
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">सभी के लिये उपयुक्त प्लान</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            अपनी आवश्यकताओं के अनुसार सबसे बढ़िया प्लान चुनें और आज ही आरम्भ करें।
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Calculator className="h-4 w-4" />
            <span>सभी पैकेज 30 दिनों तक वैध • बचत ऑफर का लाभ उठायें</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
          {plans.map((plan, index) => {
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
                          30 दिन की वैधता | 18% GST 
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
                          {user ? "अभी खरीदें" : "साइनअप करें"}
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button variant="outline" size="lg" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
              सभी प्लान देखें
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreviewSection;
