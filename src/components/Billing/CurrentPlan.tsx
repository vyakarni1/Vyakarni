
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { CreditCard, Star, Users, FileText, ShoppingBag, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const CurrentPlan = () => {
  const { balance, fetchBalance, loading } = useWordCredits();
  const { lastUpdate } = useRealtimeSubscription();

  // Refresh word credit data when realtime updates occur
  useEffect(() => {
    if (lastUpdate > 0) {
      console.log('CurrentPlan: Realtime update detected, refreshing word credits...');
      fetchBalance();
    }
  }, [lastUpdate, fetchBalance]);

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

  // Simple tier determination based on purchased words
  const getWordCreditTier = () => {
    if (balance.purchased_words >= 25000) {
      return { name: 'प्रोफेशनल टियर', type: 'professional', badge: 'bg-purple-600 hover:bg-purple-700' };
    } else if (balance.purchased_words >= 5000) {
      return { name: 'हॉबी टियर', type: 'hobby', badge: 'bg-blue-600 hover:bg-blue-700' };
    } else {
      return { name: 'मुफ्त टियर', type: 'free', badge: 'bg-gray-600 hover:bg-gray-700' };
    }
  };

  const currentTier = getWordCreditTier();

  // Get word limits based on tier
  const getWordLimits = () => {
    switch (currentTier.type) {
      case 'professional':
        return { maxWordsPerCorrection: 2000, maxCorrectionsPerMonth: 1000, teamMembers: 5 };
      case 'hobby':
        return { maxWordsPerCorrection: 500, maxCorrectionsPerMonth: 200, teamMembers: 1 };
      default:
        return { maxWordsPerCorrection: 100, maxCorrectionsPerMonth: 50, teamMembers: 1 };
    }
  };

  const limits = getWordLimits();

  // Get features based on tier
  const getFeatures = () => {
    const baseFeatures = [
      "हिंदी व्याकरण जाँच",
      "वाक्य सुधार सुझाव",
      "स्थायी शब्द क्रेडिट"
    ];

    if (currentTier.type === 'free') {
      return baseFeatures;
    }

    const premiumFeatures = [
      ...baseFeatures,
      "समर्पित सहायता",
      "विस्तृत रिपोर्ट",
      "उन्नत व्याकरण जाँच"
    ];

    if (currentTier.type === 'hobby') {
      return premiumFeatures;
    }

    if (currentTier.type === 'professional') {
      return [
        ...premiumFeatures,
        "एडवांस AI फीचर्स",
        "प्राथमिकता सपोर्ट",
        "API एक्सेस"
      ];
    }

    return baseFeatures;
  };

  return (
    <div className="space-y-6">
      {/* Current Word Credit Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>शब्द क्रेडिट स्थिति</span>
            </div>
            <Badge className={currentTier.badge}>{currentTier.name}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{currentTier.name}</h3>
              <p className="text-sm text-gray-600">
                {balance.total_words_available.toLocaleString()} शब्द उपलब्ध
              </p>
              {balance.purchased_words > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {balance.purchased_words.toLocaleString()} शब्द खरीदे गये (स्थायी)
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">शब्द सीमा प्रति सुधार</p>
                  <p className="text-sm text-gray-600">
                    {limits.maxWordsPerCorrection.toLocaleString()} शब्द
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">टीम सदस्य</p>
                  <p className="text-sm text-gray-600">{limits.teamMembers}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">कुल शब्द</p>
                  <p className="text-sm text-gray-600">{balance.total_words_available.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">खरीदे गये शब्द</p>
                  <p className="text-sm text-gray-600">
                    {balance.purchased_words.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>उपलब्ध फीचर्स</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {getFeatures().map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
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
              {currentTier.type === 'free' ? 'शब्द क्रेडिट खरीदें' : 'अधिक शब्द खरीदें'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Free Users */}
      {currentTier.type === 'free' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Star className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                अधिक शब्द क्रेडिट खरीदें
              </h3>
              <p className="text-orange-700 mb-4">
                उत्कृष्ट सुविधाओं और अधिक शब्द सीमा का लाभ उठायें
              </p>
              <Link to="/pricing">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  अभी खरीदें
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
