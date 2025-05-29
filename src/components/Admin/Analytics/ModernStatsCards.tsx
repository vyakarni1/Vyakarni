
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Crown, 
  Calendar,
  BarChart3,
  Zap
} from 'lucide-react';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  gradient, 
  bgGradient 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  gradient: string;
  bgGradient: string;
}) => (
  <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br ${bgGradient} relative overflow-hidden cursor-pointer transform hover:scale-105`}>
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/5 rounded-full"></div>
    
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      <div className={`p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${gradient}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="flex items-baseline space-x-2">
        <div className={`text-3xl font-bold bg-gradient-to-r ${gradient.replace('to-br', 'to-r')} bg-clip-text text-transparent`}>
          {value}
        </div>
        {change && (
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex items-center">
        <div className="w-full bg-white/30 rounded-full h-1.5">
          <div 
            className={`bg-gradient-to-r ${gradient.replace('to-br', 'to-r')} h-1.5 rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min((Number(value) / 100) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ModernStatsCards = () => {
  const { analytics, loading } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-10 bg-gray-300 rounded-xl"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-300 rounded mb-3"></div>
              <div className="h-2 w-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "कुल उपयोगकर्ता",
      value: analytics?.total_users || 0,
      change: `+${analytics?.users_today || 0} आज`,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "सक्रिय सब्सक्रिप्शन",
      value: analytics?.active_subscriptions || 0,
      change: `${analytics?.total_subscriptions || 0} कुल`,
      icon: Crown,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "कुल आय",
      value: `₹${analytics?.total_revenue?.toLocaleString('hi-IN') || 0}`,
      change: `₹${analytics?.revenue_this_month?.toLocaleString('hi-IN') || 0} इस महीने`,
      icon: DollarSign,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
    },
    {
      title: "आज के सुधार",
      value: analytics?.corrections_today || 0,
      change: `${analytics?.corrections_this_week || 0} इस सप्ताह`,
      icon: Activity,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      title: "मुफ़्त उपयोगकर्ता",
      value: analytics?.free_users || 0,
      icon: Users,
      gradient: "from-gray-500 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
    },
    {
      title: "प्रीमियम उपयोगकर्ता",
      value: analytics?.premium_users || 0,
      icon: Crown,
      gradient: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100",
    },
    {
      title: "इस सप्ताह नए",
      value: analytics?.users_this_week || 0,
      icon: Calendar,
      gradient: "from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100",
    },
    {
      title: "महीने के सुधार",
      value: analytics?.corrections_this_month || 0,
      icon: Zap,
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default ModernStatsCards;
