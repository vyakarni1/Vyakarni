
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import ModernStatsCards from '@/components/Admin/Analytics/ModernStatsCards';
import { 
  UserGrowthChart, 
  SubscriptionDistributionChart, 
  RevenueChart, 
  UsageAnalyticsChart 
} from '@/components/Admin/Analytics/AnalyticsCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell,
  Users,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsCard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "उपयोगकर्ता प्रबंधन",
      description: "भूमिकाएं और सब्सक्रिप्शन प्रबंधित करें",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      onClick: () => navigate('/admin/users'),
    },
    {
      title: "एनालिटिक्स देखें",
      description: "विस्तृत रिपोर्ट और चार्ट",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      onClick: () => navigate('/admin/analytics'),
    },
    {
      title: "संपर्क संदेश",
      description: "नए संदेशों की समीक्षा करें",
      icon: Bell,
      color: "from-purple-500 to-purple-600",
      onClick: () => navigate('/admin/contacts'),
    },
    {
      title: "सिस्टम स्थिति",
      description: "सिस्टम हेल्थ मॉनिटर करें",
      icon: Activity,
      color: "from-orange-500 to-orange-600",
      onClick: () => navigate('/admin/settings'),
    },
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          त्वरित कार्य
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={action.onClick}
            className="group p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 border border-gray-200/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const SystemStatusCard = () => {
  const statusItems = [
    { name: "डेटाबेस", status: "healthy", color: "green" },
    { name: "API सर्वर", status: "healthy", color: "green" },
    { name: "पेमेंट गेटवे", status: "warning", color: "yellow" },
    { name: "ईमेल सेवा", status: "healthy", color: "green" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };
    
    return colors[status as keyof typeof colors] || colors.error;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          सिस्टम स्थिति
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {statusItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
            <div className="flex items-center space-x-3">
              {getStatusIcon(item.status)}
              <span className="font-medium text-gray-900">{item.name}</span>
            </div>
            <Badge className={getStatusBadge(item.status)}>
              {item.status === "healthy" ? "सक्रिय" : item.status === "warning" ? "चेतावनी" : "त्रुटि"}
            </Badge>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">अपटाइम</span>
            <span className="font-semibold text-green-600">99.9%</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">औसत प्रतिक्रिया समय</span>
            <span className="font-semibold text-blue-600">142ms</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ModernDashboard = () => {
  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              व्यवस्थापक डैशबोर्ड
            </h1>
            <p className="text-gray-600 mt-1">
              सिस्टम अवलोकन और रियल-टाइम एनालिटिक्स • {new Date().toLocaleDateString('hi-IN')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">लाइव डेटा</span>
          </div>
        </div>

        {/* Stats Cards */}
        <ModernStatsCards />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserGrowthChart />
          <SubscriptionDistributionChart />
          <RevenueChart />
          <UsageAnalyticsChart />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActionsCard />
          <SystemStatusCard />
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default ModernDashboard;
