
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { AlertTriangle, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const UsageLimitDisplay = () => {
  const { subscription, usage, getRemainingCorrections, getUsagePercentage } = useUsageLimits();

  if (!subscription || !usage) {
    return null;
  }

  const remainingCorrections = getRemainingCorrections();
  const usagePercentage = getUsagePercentage();
  const isUnlimited = usage.max_corrections === -1;
  const isNearLimit = usagePercentage > 80 && !isUnlimited;
  const isAtLimit = usagePercentage >= 100 && !isUnlimited;

  const getPlanIcon = () => {
    switch (subscription.plan_type) {
      case 'pro':
        return <Zap className="h-4 w-4" />;
      case 'team':
        return <Crown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPlanColor = () => {
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>उपयोग की स्थिति</span>
            <Badge className={`${getPlanColor()} flex items-center space-x-1`}>
              {getPlanIcon()}
              <span>{subscription.plan_name}</span>
            </Badge>
          </CardTitle>
          {(isNearLimit || isAtLimit) && (
            <AlertTriangle className={`h-5 w-5 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Word Limit */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">प्रति सुधार शब्द सीमा</span>
            <span className="text-sm text-gray-600">{usage.max_words_per_correction} शब्द</span>
          </div>
        </div>

        {/* Correction Limit */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">मासिक सुधार सीमा</span>
            <span className="text-sm text-gray-600">
              {isUnlimited ? 'असीमित' : `${usage.corrections_used}/${usage.max_corrections}`}
            </span>
          </div>
          {!isUnlimited && (
            <Progress 
              value={usagePercentage} 
              className={`h-2 ${isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-green-100'}`}
            />
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {isUnlimited ? 'असीमित सुधार उपलब्ध' : `${remainingCorrections} सुधार शेष`}
            </span>
            {isAtLimit && (
              <Link to="/pricing">
                <Button size="sm" className="h-7 text-xs">
                  अपग्रेड करें
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Warning Messages */}
        {isNearLimit && !isAtLimit && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ आपकी मासिक सीमा लगभग समाप्त हो रही है। अधिक सुधार के लिए प्रो प्लान में अपग्रेड करें।
            </p>
          </div>
        )}

        {isAtLimit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 mb-2">
              🚫 आपकी मासिक सुधार सीमा समाप्त हो गई है। अधिक सुधार के लिए प्रो प्लान में अपग्रेड करें।
            </p>
            <Link to="/pricing">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                अभी अपग्रेड करें
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
