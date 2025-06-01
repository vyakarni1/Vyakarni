
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ShoppingBag, TrendingUp, Zap, Target, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useWordCredits } from "@/hooks/useWordCredits";
import { useUsageStats } from "@/hooks/useUsageStats";

const SmartRecommendationsCard = () => {
  const { balance, plans } = useWordCredits();
  const { stats } = useUsageStats();

  const avgWordsPerCorrection = 50;
  const monthlyWordUsage = stats.corrections_this_month * avgWordsPerCorrection;
  const dailyWordUsage = stats.corrections_today * avgWordsPerCorrection;
  
  const isLowBalance = balance.total_words_available < 100;
  const isVeryLowBalance = balance.total_words_available < 50;
  const isHighUsage = monthlyWordUsage > 1000;
  const isFrequentUser = stats.corrections_today > 5;

  const recommendations = [];

  // Critical: Very low balance
  if (isVeryLowBalance) {
    recommendations.push({
      icon: <ShoppingBag className="h-4 w-4" />,
      title: "तुरंत शब्द खरीदयें!",
      description: `केवल ${balance.total_words_available} शब्द बचे हैं। व्याकरण चेकर का निरंतर उपयोग करने के लिये अभी शब्द खरीदयें।`,
      action: "अभी खरीदयें",
      link: "/pricing",
      color: "bg-red-100 text-red-800",
      priority: "high"
    });
  } 
  // Warning: Low balance
  else if (isLowBalance) {
    recommendations.push({
      icon: <Target className="h-4 w-4" />,
      title: "शब्द बैलेंस कम है",
      description: `${balance.total_words_available} शब्द बचे हैं। आपके उपयोग के अनुसार यह जल्दी समाप्त हो सकता है।`,
      action: "शब्द पैकेज देखयें",
      link: "/pricing",
      color: "bg-orange-100 text-orange-800",
      priority: "medium"
    });
  }

  // High usage pattern recommendation
  if (isHighUsage && !isLowBalance) {
    const recommendedPlan = plans.find(plan => plan.words_included >= monthlyWordUsage * 1.5);
    if (recommendedPlan) {
      recommendations.push({
        icon: <TrendingUp className="h-4 w-4" />,
        title: "बड़ा पैकेज लयें",
        description: `आप माह में ~${monthlyWordUsage.toLocaleString()} शब्द उपयोग करते हैं। ${recommendedPlan.plan_name} पैकेज अधिक किफायती होगा।`,
        action: "पैकेज देखयें",
        link: "/pricing",
        color: "bg-blue-100 text-blue-800",
        priority: "medium"
      });
    }
  }

  // Frequent user optimization
  if (isFrequentUser && dailyWordUsage < 200) {
    recommendations.push({
      icon: <Zap className="h-4 w-4" />,
      title: "उपयोग को अनुकूलित करयें",
      description: "छोटे टेक्स्ट की बजाय लंबे पैराग्राफ एक साथ जाँचयें। इससे बेहतर परिणाम और कम शब्द खर्च होंगे।",
      action: "टिप्स देखयें",
      link: "/grammar-checker",
      color: "bg-purple-100 text-purple-800",
      priority: "low"
    });
  }

  // Expiry warning
  if (balance.next_expiry_date && balance.purchased_words > 0) {
    const expiryDate = new Date(balance.next_expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      recommendations.push({
        icon: <Clock className="h-4 w-4" />,
        title: "शब्द जल्दी समाप्त होंगे",
        description: `आपके ${balance.purchased_words} खरीदे गये शब्द ${daysUntilExpiry} दिन में समाप्त हो जायेंगे। नये शब्द खरीदने पर विचार करयें।`,
        action: "नवीनीकरण करयें",
        link: "/pricing",
        color: "bg-yellow-100 text-yellow-800",
        priority: "medium"
      });
    }
  }

  // Good usage pattern - positive reinforcement
  if (!isLowBalance && !isHighUsage && stats.total_corrections > 10) {
    recommendations.push({
      icon: <Lightbulb className="h-4 w-4" />,
      title: "बेहतरीन उपयोग!",
      description: "आप अपने शब्दों का संतुलित उपयोग कर रहे हैं। व्याकरण की गुणवत्ता में सुधार जारी रखयें।",
      action: "और सुधार करयें",
      link: "/grammar-checker",
      color: "bg-green-100 text-green-800",
      priority: "low"
    });
  }

  // Sort by priority
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

  if (recommendations.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-green-500" />
            <span>सब कुछ बढ़िया है!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">आपका शब्द बैलेंस और उपयोग पैटर्न पूर्ण रूप से संतुलित है। व्याकरण सुधार जारी रखयें!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>स्मार्ट सुझाव</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.slice(0, 2).map((rec, index) => (
          <div key={index} className={`p-3 border rounded-lg hover:shadow-md transition-shadow ${
            rec.priority === 'high' ? 'border-red-200 bg-red-50' : 
            rec.priority === 'medium' ? 'border-orange-200 bg-orange-50' : 
            'border-gray-200'
          }`}>
            <div className="flex items-start space-x-3">
              <Badge className={`${rec.color} flex items-center space-x-1`}>
                {rec.icon}
              </Badge>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">{rec.description}</p>
                <Link to={rec.link}>
                  <Button 
                    size="sm" 
                    variant={rec.priority === 'high' ? 'default' : 'outline'} 
                    className={`text-xs ${
                      rec.priority === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' : ''
                    }`}
                  >
                    {rec.action}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {recommendations.length > 2 && (
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">+{recommendations.length - 2} और सुझाव उपलब्ध</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsCard;
