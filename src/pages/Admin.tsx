
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, MessageSquare, CreditCard } from "lucide-react";

const Admin = () => {
  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: "कुल उपयोगकर्ता",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "मासिक आय",
      value: "₹45,678",
      change: "+8%",
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "व्याकरण जांच",
      value: "8,456",
      change: "+15%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "संपर्क संदेश",
      value: "23",
      change: "नया",
      icon: MessageSquare,
      color: "text-orange-600"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">डैशबोर्ड</h1>
          <p className="text-gray-600 mt-2">व्याकरणी एडमिन पैनल में आपका स्वागत है</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} पिछले महीने से
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>हाल की गतिविधि</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">नया उपयोगकर्ता पंजीकृत</span>
                  <span className="text-xs text-gray-400 ml-auto">2 मिनट पहले</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">व्याकरण जांच पूर्ण</span>
                  <span className="text-xs text-gray-400 ml-auto">5 मिनट पहले</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">नया संपर्क संदेश</span>
                  <span className="text-xs text-gray-400 ml-auto">10 मिनट पहले</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>सिस्टम स्थिति</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API स्थिति</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">डेटाबेस</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">भंडारण</span>
                  <span className="text-sm text-green-600 font-medium">चालू</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">प्रदर्शन</span>
                  <span className="text-sm text-yellow-600 font-medium">औसत</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
