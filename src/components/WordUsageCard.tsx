
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingDown, Calendar, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useUsageStats } from "@/hooks/useUsageStats";

const WordUsageCard = () => {
  const { balance } = useWordCredits();
  const { stats, loading } = useUsageStats();

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

  // Calculate estimated words used (assuming average words per correction)
  const avgWordsPerCorrection = 50; // Reasonable estimate
  const estimatedWordsUsedToday = stats.corrections_today * avgWordsPerCorrection;
  const estimatedWordsUsedThisMonth = stats.corrections_this_month * avgWordsPerCorrection;

  // Calculate usage percentage (if we had starting balance)
  const usagePercentage = balance.total_words_available > 0 ? 
    Math.min(100, (estimatedWordsUsedThisMonth / (balance.total_words_available + estimatedWordsUsedThisMonth)) * 100) : 0;

  const isHighUsage = usagePercentage > 70;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>शब्द उपयोग</span>
          </CardTitle>
          <Badge className={isHighUsage ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}>
            इस महीने
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Monthly Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">अनुमानित मासिक उपयोग</span>
            <span className="text-sm font-semibold text-blue-600">
              ~{estimatedWordsUsedThisMonth.toLocaleString()} शब्द
            </span>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className={`h-3 ${isHighUsage ? 'bg-orange-100' : 'bg-blue-100'}`}
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stats.corrections_this_month} सुधार किए</span>
            <span>{usagePercentage.toFixed(0)}% उपयोग</span>
          </div>
        </div>

        {/* Daily Usage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">आज का उपयोग</span>
            <span className="text-sm font-medium text-green-600">
              ~{estimatedWordsUsedToday.toLocaleString()} शब्द
            </span>
          </div>
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{stats.corrections_today} सुधार आज तक</span>
          </div>
        </div>

        {/* Usage Efficiency */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">औसत शब्द प्रति सुधार</span>
            <span className="text-sm font-medium text-purple-600">
              ~{avgWordsPerCorrection} शब्द
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Info className="h-3 w-3" />
            <span>बेहतर परिणामों के लिए लंबे टेक्स्ट का उपयोग करें</span>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        {isHighUsage && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800 font-medium">अधिक उपयोग की चेतावनी</p>
            </div>
            <p className="text-xs text-orange-700 mb-2">
              आप इस महीने अधिक शब्दों का उपयोग कर रहे हैं। अधिक शब्द खरीदने पर विचार करें।
            </p>
            <Link to="/pricing">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                शब्द पैकेज देखें
              </Button>
            </Link>
          </div>
        )}

        {!isHighUsage && balance.total_words_available > 500 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              बेहतरीन! आपका शब्द उपयोग संतुलित है।
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordUsageCard;
