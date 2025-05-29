
import { useAuth } from "@/components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Check, Star, Users, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import type { Json } from '@/integrations/supabase/types';

interface Plan {
  id: string;
  plan_name: string;
  plan_type: string;
  price_monthly: number;
  price_yearly: number;
  max_words_per_correction: number;
  max_corrections_per_month: number;
  max_team_members: number;
  features: string[];
  is_active: boolean;
}

// Helper function to convert Json to string array
const parseFeatures = (features: Json): string[] => {
  if (Array.isArray(features)) {
    return features as string[];
  }
  return [];
};

const Pricing = () => {
  const { user, loading: authLoading } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly', { ascending: true });

        if (error) {
          console.error('Error fetching plans:', error);
          toast.error('प्लान लोड करने में त्रुटि');
          return;
        }

        if (data) {
          const parsedPlans: Plan[] = data.map(plan => ({
            ...plan,
            features: parseFeatures(plan.features)
          }));
          setPlans(parsedPlans);
        }
      } catch (error) {
        console.error('Error in fetchPlans:', error);
        toast.error('प्लान लोड करने में त्रुटि');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("सफलतापूर्वक लॉग आउट हो गए!");
      navigate("/");
    } catch (error) {
      toast.error("लॉग आउट में त्रुटि");
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (plan.plan_type === 'free') {
      toast.info("आप पहले से ही फ्री प्लान पर हैं!");
      return;
    }

    // For now, just show a message - we'll implement Razorpay later
    toast.info(`${plan.plan_name} प्लान जल्द ही उपलब्ध होगा!`);
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'free':
        return <Zap className="h-6 w-6" />;
      case 'pro':
        return <Star className="h-6 w-6" />;
      case 'team':
        return <Crown className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'pro':
        return 'from-blue-500 to-purple-600';
      case 'team':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const isCurrentPlan = (planType: string) => {
    return subscription?.plan_type === planType;
  };

  if (authLoading || loading) {
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
            मूल्य निर्धारण
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            अपनी आवश्यकताओं के अनुसार सही प्लान चुनें
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              मासिक
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              वार्षिक
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                2 महीने फ्री!
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                plan.plan_type === 'pro' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'
              } ${isCurrentPlan(plan.plan_type) ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.plan_type === 'pro' && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                  सबसे लोकप्रिय
                </div>
              )}
              
              {isCurrentPlan(plan.plan_type) && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2 text-sm font-medium">
                  वर्तमान प्लान
                </div>
              )}

              <CardHeader className={`text-center ${plan.plan_type === 'pro' || isCurrentPlan(plan.plan_type) ? 'pt-12' : 'pt-6'}`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor(plan.plan_type)} text-white mb-4 mx-auto`}>
                  {getPlanIcon(plan.plan_type)}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.plan_name}</CardTitle>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly}
                  </span>
                  <span className="text-gray-500">
                    /{billingCycle === 'monthly' ? 'महीना' : 'साल'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price_yearly > 0 && (
                  <p className="text-sm text-green-600">
                    मासिक की तुलना में ₹{(plan.price_monthly * 12) - plan.price_yearly} की बचत
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Limits */}
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">प्रति सुधार शब्द सीमा:</span>
                    <span className="font-medium">{plan.max_words_per_correction}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">मासिक सुधार:</span>
                    <span className="font-medium">
                      {plan.max_corrections_per_month === -1 ? 'असीमित' : plan.max_corrections_per_month}
                    </span>
                  </div>
                  {plan.plan_type === 'team' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">टीम सदस्य:</span>
                      <span className="font-medium">{plan.max_team_members}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan(plan.plan_type)}
                  className={`w-full mt-6 ${
                    plan.plan_type === 'pro'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : plan.plan_type === 'team'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  } ${isCurrentPlan(plan.plan_type) ? 'bg-green-600 hover:bg-green-600' : ''}`}
                >
                  {isCurrentPlan(plan.plan_type) 
                    ? 'वर्तमान प्लान' 
                    : plan.plan_type === 'free' 
                    ? 'फ्री शुरू करें' 
                    : 'अपग्रेड करें'
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">अक्सर पूछे जाने वाले प्रश्न</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">क्या मैं कभी भी प्लान बदल सकता हूं?</h3>
              <p className="text-gray-600 text-sm">जी हां, आप कभी भी अपना प्लान अपग्रेड या डाउनग्रेड कर सकते हैं।</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">क्या रिफंड की सुविधा है?</h3>
              <p className="text-gray-600 text-sm">हां, खरीदारी के 7 दिन के अंदर पूर्ण रिफंड की सुविधा है।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
