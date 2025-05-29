
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useUsageLimits } from "@/hooks/useUsageLimits";

const UsageProgressCard = () => {
  const { subscription, usage, getRemainingCorrections, getUsagePercentage } = useUsageLimits();

  if (!subscription || !usage) {
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

  const remainingCorrections = getRemainingCorrections();
  const usagePercentage = getUsagePercentage();
  const isUnlimited = usage.max_corrections === -1;
  const isNearLimit = usagePercentage > 80 && !isUnlimited;
  const isAtLimit = usagePercentage >= 100 && !isUnlimited;

  const getStatusIcon = () => {
    if (isAtLimit) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (isNearLimit) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const getStatusColor = () => {
    if (isAtLimit) return 'bg-red-100 text-red-800';
    if (isNearLimit) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-100';
    if (isNearLimit) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>इस महीने का उपयोग</span>
          </CardTitle>
          {getStatusIcon()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Corrections Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">सुधार उपयोग</span>
            <Badge className={getStatusColor()}>
              {isUnlimited ? 'असीमित' : `${usage.corrections_used}/${usage.max_corrections}`}
            </Badge>
          </div>
          
          {!isUnlimited && (
            <Progress 
              value={usagePercentage} 
              className={`h-3 ${getProgressColor()}`}
            />
          )}
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {isUnlimited ? 'असीमित सुधार' : `${remainingCorrections} सुधार शेष`}
            </span>
            <span>{isUnlimited ? '∞' : `${usagePercentage.toFixed(0)}%`}</span>
          </div>
        </div>

        {/* Words Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">शब्द प्रसंस्करण</span>
            <span className="text-sm font-medium text-blue-600">{usage.words_processed}</span>
          </div>
          <div className="text-xs text-gray-500">
            प्रति सुधार अधिकतम: {usage.max_words_per_correction} शब्द
          </div>
        </div>

        {/* Status Messages */}
        {isAtLimit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-2">
              🚫 मासिक सीमा समाप्त! अधिक सुधार के लिए अपग्रेड करें।
            </p>
            <Link to="/pricing">
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                अभी अपग्रेड करें
              </Button>
            </Link>
          </div>
        )}

        {isNearLimit && !isAtLimit && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ सीमा लगभग समाप्त! अधिक सुधार के लिए प्रो प्लान पर विचार करें।
            </p>
          </div>
        )}

        {isUnlimited && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              असीमित सुधार उपलब्ध! आपका {subscription.plan_name} प्लान सक्रिय है।
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageProgressCard;
