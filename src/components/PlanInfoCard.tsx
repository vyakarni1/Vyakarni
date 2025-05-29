
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const PlanInfoCard = () => {
  const { subscription, loading } = useSubscription();

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

  if (!subscription) return null;

  const getPlanIcon = () => {
    switch (subscription.plan_type) {
      case 'pro':
        return <Zap className="h-5 w-5" />;
      case 'team':
        return <Crown className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlanColor = () => {
    switch (subscription.plan_type) {
      case 'pro':
        return 'from-blue-500 to-purple-600';
      case 'team':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBadgeColor = () => {
    switch (subscription.plan_type) {
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'team':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getPlanColor()} rounded-bl-full opacity-10`}></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor()} text-white`}>
              {getPlanIcon()}
            </div>
            <span>वर्तमान प्लान</span>
          </CardTitle>
          <Badge className={`${getBadgeColor()} flex items-center space-x-1`}>
            <CheckCircle className="h-3 w-3" />
            <span>सक्रिय</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{subscription.plan_name}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">शब्द सीमा:</span>
              <div className="font-semibold">{subscription.max_words_per_correction}</div>
            </div>
            <div>
              <span className="text-gray-600">मासिक सुधार:</span>
              <div className="font-semibold">
                {subscription.max_corrections_per_month === -1 ? 'असीमित' : subscription.max_corrections_per_month}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">सुविधाएं:</h4>
          <div className="flex flex-wrap gap-2">
            {subscription.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {subscription.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{subscription.features.length - 3} और
              </Badge>
            )}
          </div>
        </div>

        {subscription.plan_type === 'free' && (
          <div className="pt-2">
            <Link to="/pricing">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                प्रो में अपग्रेड करें
              </Button>
            </Link>
          </div>
        )}

        {subscription.plan_type !== 'free' && (
          <div className="pt-2">
            <Link to="/pricing">
              <Button variant="outline" className="w-full">
                प्लान प्रबंधित करें
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanInfoCard;
