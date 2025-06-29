
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWordCredits } from "@/hooks/useWordCredits";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WordCreditsOverview = () => {
  const { balance, loading } = useWordCredits();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const isLowBalance = balance.total_words_available < 100;
  const freeWordsPercentage = balance.total_words_available > 0 ? (balance.free_words / balance.total_words_available) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className={isLowBalance ? "border-orange-200 bg-orange-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल शब्द</CardTitle>
            <Coins className={`h-4 w-4 ${isLowBalance ? "text-orange-600" : "text-blue-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isLowBalance ? "text-orange-600" : "text-blue-600"}`}>
              {balance.total_words_available.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">उपलब्ध शब्द</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">निःशुल्क शब्द</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {balance.free_words.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">निःशुल्क प्राप्त</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">खरीदे गये शब्द</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {balance.purchased_words.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">खरीदारी से प्राप्त</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>शब्द वितरण</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>फ्री शब्द</span>
              <span>{balance.free_words} / {balance.total_words_available}</span>
            </div>
            <Progress value={freeWordsPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>खरीदे गए शब्द</span>
              <span>{balance.purchased_words} / {balance.total_words_available}</span>
            </div>
            <Progress 
              value={balance.total_words_available > 0 ? (balance.purchased_words / balance.total_words_available) * 100 : 0} 
              className="h-2" 
            />
          </div>

          {isLowBalance && (
            <div className="mt-4 p-4 bg-orange-100 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 mb-3">
                ⚠️ आपके शब्द कम हो रहे हैं! अधिक शब्द खरीदने के लिए नीचे दिए गए बटन पर क्लिक करें।
              </p>
              <Link to="/pricing">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  अधिक शब्द खरीदें
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordCreditsOverview;
