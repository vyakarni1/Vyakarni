
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap, Star, Crown, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import DiscountBadge from './DiscountBadge';
import { useWordCredits } from '@/hooks/useWordCredits';
import { useAuth } from '@/components/AuthProvider';

function getPlanIcon(planType: string) {
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
}

function getPlanColor(planType: string) {
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
}

const PricingPreviewSection = () => {
  const { plans, loading, getWordCreditPlans, getDiscountInfo } = useWordCredits();
  const { user } = useAuth();

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">प्लान चुनें</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              एक बार खरीदें और स्थायी रूप से उपयोग करें।
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  const wordCreditPlans = getWordCreditPlans();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">शब्द क्रेडिट प्लान</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            एक बार खरीदें और स्थायी रूप से उपयोग करें।
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
            <Calculator className="h-4 w-4" />
            <span>एक बार भुगतान • कोई समाप्ति नहीं • स्थायी एक्सेस</span>
          </div>
        </div>

        {/* Word Credit Plans */}
        <div className="mb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-6">
            {wordCreditPlans.map((plan, index) => {
              const discountInfo = getDiscountInfo(plan.plan_type);
              const totalPrice = plan.price_before_gst + (plan.price_before_gst * plan.gst_percentage / 100);
              
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
                            एक बार भुगतान | 18% GST अतिरिक्त
                          </Badge>
                          <div className="text-xs text-gray-600">
                            कुल: ₹{totalPrice.toFixed(0)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-600">निःशुल्क</div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Dynamic Features */}
                    <div className="space-y-3">
                      {plan.features && plan.features.length > 0 ? (
                        plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-3">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))
                      ) : (
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
                        </>
                      )}
                    </div>

                    {/* Button */}
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-300"
                        asChild
                      >
                        <Link to={user ? "/pricing" : "/register"}>
                          {plan.plan_type === 'free' ? "साइनअप पर मिलता है" : 
                           user ? "अभी खरीदें" : "साइनअप करें"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
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
