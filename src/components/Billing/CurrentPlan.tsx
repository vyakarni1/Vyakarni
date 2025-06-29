
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { CreditCard, Star, Users, FileText, AlertTriangle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const CurrentPlan = () => {
  const { subscription, loading, refetch } = useSubscription();
  const { balance, fetchBalance } = useWordCredits();
  const { lastUpdate } = useRealtimeSubscription();

  // Refresh subscription data when realtime updates occur
  useEffect(() => {
    if (lastUpdate > 0) {
      console.log('CurrentPlan: Realtime update detected, refreshing subscription...');
      refetch();
      fetchBalance();
    }
  }, [lastUpdate, refetch, fetchBalance]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>वर्तमान प्लान</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">कोई सक्रिय प्लान नहीं मिला</p>
            <Link to="/pricing">
              <Button>प्लान चुनें</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    // Enhanced logic to determine correct badge based on subscription type and purchased words
    const hasPurchasedWords = balance.purchased_words > 0;
    
    if (subscription.status === 'active') {
      if (subscription.plan_type === 'premium') {
        return <Badge className="bg-purple-600 hover:bg-purple-700">प्रीमियम प्लान</Badge>;
      } else if (subscription.plan_type === 'basic' || hasPurchasedWords) {
        return <Badge className="bg-blue-600 hover:bg-blue-700">बेसिक प्लान</Badge>;
      } else if (subscription.plan_type === 'free') {
        return <Badge variant="secondary">निःशुल्क प्लान</Badge>;
      } else {
        return <Badge variant="outline">सक्रिय प्लान</Badge>;
      }
    }
    return <Badge variant="destructive">निष्क्रिय</Badge>;
  };

  // Determine effective plan name based on actual status
  const getEffectivePlanName = () => {
    const hasPurchasedWords = balance.purchased_words > 0;
    
    if (hasPurchasedWords && subscription.plan_type === 'free') {
      // User has purchased words but subscription shows free - show based on purchase
      if (balance.purchased_words >= 25000) {
        return 'प्रो प्लान (Premium)';
      } else if (balance.purchased_words >= 5000) {
        return 'हॉबी प्लान (Basic)';
      }
    }
    
    return subscription.plan_name;
  };

  // Determine effective plan type
  const getEffectivePlanType = () => {
    const hasPurchasedWords = balance.purchased_words > 0;
    
    if (hasPurchasedWords && subscription.plan_type === 'free') {
      if (balance.purchased_words >= 25000) {
        return 'premium';
      } else if (balance.purchased_words >= 5000) {
        return 'basic';
      }
    }
    
    return subscription.plan_type;
  };

  const effectivePlanName = getEffectivePlanName();
  const effectivePlanType = getEffectivePlanType();

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>वर्तमान प्लान</span>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{effectivePlanName}</h3>
              <p className="text-sm text-gray-600 capitalize">प्लान प्रकार: {effectivePlanType}</p>
              {balance.purchased_words > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {balance.purchased_words.toLocaleString()} शब्द खरीदे गए
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">शब्द सीमा प्रति सुधार</p>
                  <p className="text-sm text-gray-600">
                    {subscription.max_words_per_correction.toLocaleString()} शब्द
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">टीम सदस्य</p>
                  <p className="text-sm text-gray-600">{subscription.max_team_members}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">उपलब्ध शब्द</p>
                  <p className="text-sm text-gray-600">{balance.total_words_available.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">प्लान स्थिति</p>
                  <p className="text-sm text-gray-600">
                    {subscription.status === 'active' ? 'सक्रिय' : 'निष्क्रिय'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>प्लान फीचर्स</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {subscription.features && subscription.features.length > 0 ? (
              subscription.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">हिंदी व्याकरण जांच</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">वाक्य सुधार सुझाव</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">स्थायी शब्द क्रेडिट</span>
                </div>
                {effectivePlanType !== 'free' && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">समर्पित सहायता</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">विस्तृत रिपोर्ट</span>
                    </div>
                  </>
                )}
                {effectivePlanType === 'premium' && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">एडवांस AI फीचर्स</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">प्राथमिकता सपोर्ट</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>त्वरित कार्यवाही</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/pricing" className="block">
            <Button className="w-full">
              <CreditCard className="h-4 w-4 mr-2" />
              {effectivePlanType === 'free' ? 'प्लान अपग्रेड करें' : 'अधिक शब्द खरीदें'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Free Plan */}
      {effectivePlanType === 'free' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                प्रो प्लान में अपग्रेड करें
              </h3>
              <p className="text-orange-700 mb-4">
                अधिक शब्द सीमा और एडवांस फीचर्स का लाभ उठाएं
              </p>
              <Link to="/pricing">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  अपग्रेड करें
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurrentPlan;
