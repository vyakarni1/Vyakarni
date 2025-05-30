
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Sparkles, Coins, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardActionCardsProps {
  profile: any;
  userEmail: string;
  balance: number;
}

const DashboardActionCards = ({ profile, userEmail, balance }: DashboardActionCardsProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              व्यक्तिगत जानकारी
            </CardTitle>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile?.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg">
                {(profile?.name || userEmail?.[0] || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-bold text-gray-800">{profile?.name || "उपयोगकर्ता"}</div>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>
          <div className="pt-2 text-sm text-gray-600">
            खाता स्थिति: <span className="text-green-600 font-medium">सक्रिय</span>
          </div>
          <div className="pt-2 text-sm text-gray-600 flex items-center">
            <Coins className="h-4 w-4 mr-1 text-blue-500" />
            कुल शब्द: <span className="font-medium text-blue-600">{balance}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-bl-full opacity-10"></div>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-gray-800 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
            व्याकरण सुधारक
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 leading-relaxed">
            अपने हिंदी पाठ को AI की शक्ति से तुरंत सुधारें और त्रुटिरहित बनाएं
          </p>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>व्याकरण की त्रुटियां</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-purple-600">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>वर्तनी की जांच</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>विराम चिह्न सुधार</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-center">
            <Coins className="h-3 w-3 mr-1" />
            आपका बैलेंस: {balance} शब्द
          </div>
          <Link to="/grammar-checker" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform group-hover:scale-105">
              व्याकरण सुधारक खोलें
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Billing & Usage Card */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              एनालिटिक्स
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            बिलिंग और उपयोग
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            अपने खाते की जानकारी, शब्द उपयोग और बिलिंग हिस्ट्री देखें
          </p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              बैलेंस: {balance} शब्द
            </div>
            <Link to="/billing">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                विवरण देखें
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActionCards;
