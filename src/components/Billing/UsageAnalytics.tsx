
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWordCredits } from "@/hooks/useWordCredits";
import { BarChart3, TrendingUp, Calendar, Coins } from "lucide-react";

const UsageAnalytics = () => {
  const { balance } = useWordCredits();

  // Calculate usage statistics based on word credits
  const totalWordsPurchased = balance.purchased_words + balance.free_words;
  const totalWordsUsed = totalWordsPurchased - balance.total_words_available;
  const usagePercentage = totalWordsPurchased > 0 ? (totalWordsUsed / totalWordsPurchased) * 100 : 0;

  const formatNumber = (num: number) => {
    return num.toLocaleString('hi-IN');
  };

  // Get current tier based on purchased words
  const getCurrentTier = () => {
    if (balance.purchased_words >= 25000) {
      return { name: 'प्रोफेशनल', maxWordsPerCorrection: 1000 };
    } else if (balance.purchased_words >= 5000) {
      return { name: 'हॉबी', maxWordsPerCorrection: 500 };
    } else {
      return { name: 'मुफ्त', maxWordsPerCorrection: 100 };
    }
  };

  const currentTier = getCurrentTier();

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Coins className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(balance.total_words_available)}
            </div>
            <p className="text-sm text-blue-800">बचे हुये शब्द</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalWordsUsed)}
            </div>
            <p className="text-sm text-green-800">उपयोग किये गये</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(balance.purchased_words)}
            </div>
            <p className="text-sm text-purple-800">खरीदे गये शब्द</p>
          </div>
        </div>

        {/* Current Tier Limits */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">वर्तमान टियर सीमायें</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex justify-between text-sm">
              <span>टियर प्रकार:</span>
              <span className="font-medium">{currentTier.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>शब्द प्रति सुधार:</span>
              <span className="font-medium">{formatNumber(currentTier.maxWordsPerCorrection)}</span>
            </div>
          </div>
        </div>

        {/* Credit Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">शब्द क्रेडिट विस्तार</h4>
          <div className="space-y-2">
            {balance.free_words > 0 && (
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>निःशुल्क शब्द</span>
                </span>
                <span className="font-medium">{formatNumber(balance.free_words)}</span>
              </div>
            )}
            {balance.purchased_words > 0 && (
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>खरीदे गये शब्द</span>
                </span>
                <span className="font-medium">{formatNumber(balance.purchased_words)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>कुल उपलब्ध</span>
              </span>
              <span>{formatNumber(balance.total_words_available)}</span>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium mb-2 text-blue-800">उपयोग सुझाव</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• छोटे टेक्स्ट को बार-बार जाँचने से बचें</li>
            <li>• एक साथ अधिक टेक्स्ट जाँचें ({currentTier.maxWordsPerCorrection} शब्द तक)</li>
            <li>• आपके खरीदे गये शब्द 180 दिनों तक मान्य हैं</li>
            <li>• अधिक शब्दों के लिये नया पैकेज खरीदें</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageAnalytics;
