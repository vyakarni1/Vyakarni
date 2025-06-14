
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Clock, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useSubscription } from "@/hooks/useSubscription";

const WordBalanceCard = () => {
  const { balance, loading } = useWordCredits();
  const { subscription } = useSubscription();

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const isLowBalance = balance.total_words_available < 100;
  const isVeryLowBalance = balance.total_words_available < 50;

  // Check if user has a paid subscription including हॉबी प्लान (Basic)
  const hasPaidSubscription = subscription && (
    subscription.plan_name === 'हॉबी प्लान (Basic)' ||
    subscription.plan_type === 'basic' ||
    subscription.plan_type === 'premium' ||
    subscription.plan_type === 'pro'
  );

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBalanceColor = () => {
    if (isVeryLowBalance) return 'from-red-500 to-red-600';
    if (isLowBalance) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-green-600';
  };

  const getBalanceBg = () => {
    if (isVeryLowBalance) return 'from-red-50 to-red-100';
    if (isLowBalance) return 'from-orange-50 to-orange-100';
    return 'from-green-50 to-green-100';
  };

  const getStatusIcon = () => {
    if (isVeryLowBalance) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (isLowBalance) return <AlertTriangle className="h-5 w-5 text-orange-600" />;
    return <Coins className="h-5 w-5 text-green-600" />;
  };

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br ${getBalanceBg()} relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getBalanceColor()} rounded-bl-full opacity-10`}></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getBalanceColor()} text-white`}>
              {getStatusIcon()}
            </div>
            <span>शब्द बैलेंस</span>
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={isLowBalance ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
              {balance.total_words_available} शब्द
            </Badge>
            {hasPaidSubscription && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                सक्रिय प्लान
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${getBalanceColor()} bg-clip-text text-transparent`}>
            {balance.total_words_available.toLocaleString()} शब्द
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {balance.free_words > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="text-gray-600">फ्री:</span>
                  <div className="font-semibold">{balance.free_words}</div>
                </div>
              </div>
            )}
            {balance.subscription_words > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <span className="text-gray-600">सब्स्क्रिप्शन:</span>
                  <div className="font-semibold">{balance.subscription_words}</div>
                </div>
              </div>
            )}
            {balance.topup_words > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="text-gray-600">टॉप-अप:</span>
                  <div className="font-semibold">{balance.topup_words}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {balance.next_expiry_date && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 p-2 bg-white/50 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>अगली समाप्ति: {formatExpiryDate(balance.next_expiry_date)}</span>
          </div>
        )}

        {isLowBalance && (
          <div className={`p-3 rounded-lg border ${isVeryLowBalance ? 'bg-red-100 border-red-200' : 'bg-orange-100 border-orange-200'}`}>
            <p className={`text-sm ${isVeryLowBalance ? 'text-red-800' : 'text-orange-800'} mb-2`}>
              {isVeryLowBalance ? '🚨' : '⚠️'} आपके शब्द {isVeryLowBalance ? 'खत्म होने वाले हैं' : 'कम हो रहे हैं'}!
            </p>
            <Link to="/pricing">
              <Button size="sm" className={`${isVeryLowBalance ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {hasPaidSubscription ? 'टॉप-अप करें' : 'अभी खरीदें'}
              </Button>
            </Link>
          </div>
        )}

        {!isLowBalance && (
          <div className="pt-2">
            <Link to="/pricing">
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                {hasPaidSubscription ? 'टॉप-अप करें' : 'अधिक शब्द खरीदें'}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordBalanceCard;
