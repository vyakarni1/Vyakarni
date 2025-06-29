
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useSubscription } from "@/hooks/useSubscription";
import { BarChart3, TrendingUp, Calendar, Clock } from "lucide-react";

const UsageAnalytics = () => {
  const { balance } = useWordCredits();
  const { subscription } = useSubscription();

  // Calculate usage percentages
  const totalWordsUsed = balance.purchased_words + balance.free_words - balance.total_words_available;
  const totalWordsPurchased = balance.purchased_words + balance.free_words;
  const usagePercentage = totalWordsPurchased > 0 ? (totalWordsUsed / totalWordsPurchased) * 100 : 0;

  const formatNumber = (num: number) => {
    return num.toLocaleString('hi-IN');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>उपयोग विश्लेषण</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Usage */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>कुल शब्द उपयोग</span>
            <span>{formatNumber(totalWordsUsed)} / {formatNumber(totalWordsPurchased)}</span>
          </div>
          <Progress value={Math.min(usagePercentage, 100)} className="h-3" />
          <p className="text-xs text-gray-500">
            {usagePercentage.toFixed(1)}% शब्द उपयोग हो चुके हैं
          </p>
        </div>

        {/* Usage Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(balance.total_words_available)}
            </div>
            <p className="text-sm text-blue-800">उपलब्ध शब्द</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalWordsUsed)}
            </div>
            <p className="text-sm text-green-800">उपयोग किए गए शब्द</p>
          </div>
        </div>

        {/* Subscription Limits */}
        {subscription && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">प्लान सीमाएं</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex justify-between text-sm">
                <span>शब्द प्रति सुधार:</span>
                <span className="font-medium">{formatNumber(subscription.max_words_per_correction)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>मासिक सुधार सीमा:</span>
                <span className="font-medium">{formatNumber(subscription.max_corrections_per_month)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Expiry Warning */}
        {balance.next_expiry_date && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-orange-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">अगली समाप्ति</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              {new Date(balance.next_expiry_date).toLocaleDateString('hi-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })} को कुछ शब्द समाप्त हो जाएंगे
            </p>
          </div>
        )}

        {/* Usage Tips */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">उपयोग सुझाव</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• छोटे टेक्स्ट को बार-बार जांचने से बचें</li>
            <li>• एक साथ अधिक टेक्स्ट जांचें</li>
            <li>• टॉप-अप का उपयोग करके अधिक शब्द प्राप्त करें</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageAnalytics;
