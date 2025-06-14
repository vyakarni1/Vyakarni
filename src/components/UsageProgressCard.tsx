
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useSubscription } from "@/hooks/useSubscription";

const UsageProgressCard = () => {
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
  const isGoodBalance = balance.total_words_available > 1000;

  // Check if user has a paid subscription including हॉबी प्लान (Basic)
  const hasPaidSubscription = subscription && (
    subscription.plan_name === 'हॉबी प्लान (Basic)' ||
    subscription.plan_type === 'basic' ||
    subscription.plan_type === 'premium' ||
    subscription.plan_type === 'pro'
  );

  const getStatusIcon = () => {
    if (isLowBalance) return <Coins className="h-5 w-5 text-orange-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusColor = () => {
    if (isLowBalance) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  const getProgressColor = () => {
    if (isLowBalance) return 'bg-orange-100';
    return 'bg-green-100';
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>शब्द बैलेंस</span>
          </CardTitle>
          <div className="flex flex-col items-end space-y-1">
            {getStatusIcon()}
            {hasPaidSubscription && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                सक्रिय प्लान
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Word Balance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">उपलब्ध शब्द</span>
            <Badge className={getStatusColor()}>
              {balance.total_words_available.toLocaleString()} शब्द
            </Badge>
          </div>
          
          <Progress 
            value={Math.min((balance.total_words_available / 2000) * 100, 100)} 
            className={`h-3 ${getProgressColor()}`}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {balance.free_words > 0 ? `${balance.free_words} फ्री शब्द` : 'सभी शब्द खरीदे गए'}
            </span>
            <span>{isGoodBalance ? 'बहुत अच्छा' : isLowBalance ? 'कम बैलेंस' : 'ठीक है'}</span>
          </div>
        </div>

        {/* Word Breakdown */}
        <div className="space-y-2">
          {balance.subscription_words > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">सब्स्क्रिप्शन शब्द</span>
              <span className="text-sm font-medium text-blue-600">{balance.subscription_words.toLocaleString()}</span>
            </div>
          )}
          {balance.topup_words > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">टॉप-अप शब्द</span>
              <span className="text-sm font-medium text-purple-600">{balance.topup_words.toLocaleString()}</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            {balance.next_expiry_date 
              ? `समाप्ति: ${new Date(balance.next_expiry_date).toLocaleDateString('hi-IN')}`
              : 'कोई समाप्ति नहीं'
            }
          </div>
        </div>

        {/* Status Messages */}
        {isLowBalance && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 mb-2">
              ⚠️ शब्द बैलेंस कम है! अधिक शब्द खरीदें।
            </p>
            <Link to="/pricing">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                {hasPaidSubscription ? 'टॉप-अप करें' : 'शब्द खरीदें'}
              </Button>
            </Link>
          </div>
        )}

        {isGoodBalance && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              बहुत अच्छा! आपके पास पर्याप्त शब्द हैं।
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageProgressCard;
