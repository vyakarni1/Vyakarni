
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowUp, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUsageLimits } from "@/hooks/useUsageLimits";

const SmartRecommendationsCard = () => {
  const { subscription, usage, getUsagePercentage } = useUsageLimits();

  if (!usage) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>स्मार्ट सुझाव</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">सुझाव लोड हो रहे हैं...</p>
        </CardContent>
      </Card>
    );
  }

  // Use fallback values if subscription is not available
  const currentPlan = subscription || { plan_type: 'free', plan_name: 'Free' };
  const usagePercentage = getUsagePercentage();
  const isHighUsage = usagePercentage > 70 && currentPlan.plan_type === 'free';
  const isLowUsage = usagePercentage < 30 && currentPlan.plan_type !== 'free';

  const recommendations = [];

  // High usage recommendations for free users
  if (isHighUsage) {
    recommendations.push({
      icon: <ArrowUp className="h-4 w-4" />,
      title: "प्रो में अपग्रेड करें",
      description: "आप अपनी मुफ्त सीमा का 70% से अधिक उपयोग कर चुके हैं। असीमित सुधार के लिए प्रो प्लान में अपग्रेड करें।",
      action: "अपग्रेड करें",
      link: "/pricing",
      color: "bg-blue-100 text-blue-800"
    });
  }

  // Feature recommendations based on plan
  if (currentPlan.plan_type === 'free') {
    recommendations.push({
      icon: <Star className="h-4 w-4" />,
      title: "बेहतर सुविधाएं पाएं",
      description: "प्रो प्लान में शैली सुधार, वाक्य संरचना और व्याकरण की गहरी जांच की सुविधा मिलती है।",
      action: "सुविधाएं देखें",
      link: "/pricing",
      color: "bg-purple-100 text-purple-800"
    });
  }

  if (currentPlan.plan_type === 'pro') {
    recommendations.push({
      icon: <Users className="h-4 w-4" />,
      title: "टीम प्लान पर विचार करें",
      description: "क्या आप टीम के साथ काम करते हैं? टीम प्लान में 5 सदस्यों के लिए सुविधा मिलती है।",
      action: "टीम प्लान देखें",
      link: "/pricing",
      color: "bg-green-100 text-green-800"
    });
  }

  // Usage efficiency recommendations
  if (usage.corrections_used > 0) {
    const avgWordsPerCorrection = usage.words_processed / usage.corrections_used;
    if (avgWordsPerCorrection < 50) {
      recommendations.push({
        icon: <Lightbulb className="h-4 w-4" />,
        title: "बेहतर उपयोग की सलाह",
        description: "छोटे वाक्यों की बजाय लंबे पैराग्राफ एक साथ सुधारें। इससे बेहतर परिणाम मिलते हैं।",
        action: "टिप्स देखें",
        link: "/grammar-checker",
        color: "bg-yellow-100 text-yellow-800"
      });
    }
  }

  // Low usage for paid users
  if (isLowUsage) {
    recommendations.push({
      icon: <Lightbulb className="h-4 w-4" />,
      title: "अधिक सुविधाओं का उपयोग करें",
      description: "आप अपने प्लान की पूरी क्षमता का उपयोग नहीं कर रहे। व्याकरण चेकर के सभी फीचर्स आजमाएं।",
      action: "शुरू करें",
      link: "/grammar-checker",
      color: "bg-indigo-100 text-indigo-800"
    });
  }

  if (recommendations.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-green-500" />
            <span>बधाई हो!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">आप अपने प्लान का बेहतरीन उपयोग कर रहे हैं। व्याकरण सुधार जारी रखें!</p>
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
          <div key={index} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <Badge className={`${rec.color} flex items-center space-x-1`}>
                {rec.icon}
              </Badge>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <Link to={rec.link}>
                  <Button size="sm" variant="outline" className="text-xs">
                    {rec.action}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SmartRecommendationsCard;
