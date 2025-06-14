
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { CreditCard, Star, Calendar, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const CurrentPlan = () => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>वर्तमान प्लान</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">कोई सक्रिय प्लान नहीं मिला</p>
            <Link to="/pricing">
              <Button>प्लान चुनें</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPlanBadgeColor = (planType: string, planName: string) => {
    // Special handling for हॉबी प्लान (Basic)
    if (planName === 'हॉबी प्लान (Basic)') {
      return 'default';
    }
    
    switch (planType.toLowerCase()) {
      case 'free':
        return 'secondary';
      case 'basic':
        return 'default';
      case 'pro':
        return 'default';
      case 'premium':
        return 'default';
      default:
        return 'outline';
    }
  };

  const isPaidPlan = () => {
    return subscription.plan_name === 'हॉबी प्लान (Basic)' || 
           subscription.plan_type === 'basic' || 
           subscription.plan_type === 'premium' ||
           subscription.plan_type === 'pro';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'कोई समाप्ति नहीं';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>वर्तमान प्लान</span>
            </div>
            <Badge variant={getPlanBadgeColor(subscription.plan_type, subscription.plan_name)}>
              {subscription.plan_name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">प्लान प्रकार</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {subscription.plan_name === 'हॉबी प्लान (Basic)' ? 'Basic' : subscription.plan_type}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">समाप्ति तिथि</p>
                  <p className="text-sm text-gray-600">{formatDate(subscription.expires_at)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">शब्द सीमा प्रति सुधार</p>
                  <p className="text-sm text-gray-600">
                    {subscription.max_words_per_correction} शब्द
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">टीम सदस्य</p>
                  <p className="text-sm text-gray-600">{subscription.max_team_members}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>प्लान फीचर्स</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {subscription.features && subscription.features.length > 0 ? (
              subscription.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2">कोई फीचर जानकारी उपलब्ध नहीं है</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Limits */}
      <Card>
        <CardHeader>
          <CardTitle>उपयोग सीमाएं</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {subscription.max_words_per_correction}
              </div>
              <p className="text-sm text-blue-800">शब्द प्रति सुधार</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {subscription.max_team_members}
              </div>
              <p className="text-sm text-purple-800">टीम सदस्य</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options - Only show for truly free plans */}
      {!isPaidPlan() && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                प्रो प्लान में अपग्रेड करें
              </h3>
              <p className="text-orange-700 mb-4">
                अधिक शब्द सीमा और एडवांस फीचर्स का लाभ उठाएं
              </p>
              <Link to="/pricing">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  अपग्रेड करें
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manage Plan Options for Paid Plans */}
      {isPaidPlan() && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                प्लान प्रबंधन
              </h3>
              <p className="text-green-700 mb-4">
                आपका प्लान सक्रिय है। अधिक शब्द या अपग्रेड के लिए यहाँ क्लिक करें।
              </p>
              <Link to="/pricing">
                <Button className="bg-green-600 hover:bg-green-700">
                  प्लान प्रबंधित करें
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurrentPlan;
