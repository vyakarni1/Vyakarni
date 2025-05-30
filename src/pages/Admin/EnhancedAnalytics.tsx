
import React from 'react';
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useEnhancedAdminAnalytics } from '@/hooks/useEnhancedAdminAnalytics';
import {
  EnhancedUserGrowthChart,
  EnhancedRevenueChart,
  UserActivityChart,
  AnalyticsControlPanel
} from '@/components/Admin/Analytics/EnhancedAnalyticsCharts';

const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }: {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-2">
          <Badge variant={change >= 0 ? "default" : "destructive"} className="text-xs">
            {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
          </Badge>
        </div>
      )}
    </CardContent>
  </Card>
);

const EnhancedAnalytics = () => {
  const { analytics, isLoading } = useEnhancedAdminAnalytics();

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">उन्नत एनालिटिक्स</h1>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  // Calculate growth rates and changes
  const userGrowthRate = analytics ? 
    ((analytics.users_today - analytics.users_this_week / 7) / (analytics.users_this_week / 7 || 1)) * 100 : 0;
  
  const revenueGrowthRate = analytics?.revenue_this_month ? 
    ((analytics.revenue_this_month - (analytics.total_revenue - analytics.revenue_this_month)) / 
     (analytics.total_revenue - analytics.revenue_this_month || 1)) * 100 : 0;

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              उन्नत एनालिटिक्स डैशबोर्ड
            </h1>
            <p className="text-gray-600 mt-1">
              विस्तृत व्यावसायिक अंतर्दृष्टि और रियल-टाइम मेट्रिक्स
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">लाइव डेटा</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="कुल उपयोगकर्ता"
            value={analytics?.total_users?.toLocaleString() || '0'}
            change={userGrowthRate}
            icon={Users}
            color="blue"
            subtitle={`आज: ${analytics?.users_today || 0} नए`}
          />
          <MetricCard
            title="कुल राजस्व"
            value={`₹${analytics?.total_revenue?.toLocaleString() || '0'}`}
            change={revenueGrowthRate}
            icon={DollarSign}
            color="green"
            subtitle={`इस महीने: ₹${analytics?.revenue_this_month?.toLocaleString() || '0'}`}
          />
          <MetricCard
            title="सक्रिय सब्सक्रिप्शन"
            value={analytics?.active_subscriptions?.toLocaleString() || '0'}
            icon={Target}
            color="purple"
            subtitle="वर्तमान में सक्रिय"
          />
          <MetricCard
            title="आज के सुधार"
            value={analytics?.corrections_today?.toLocaleString() || '0'}
            icon={Activity}
            color="orange"
            subtitle={`इस सप्ताह: ${analytics?.corrections_this_week || 0}`}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="इस सप्ताह उपयोगकर्ता"
            value={analytics?.users_this_week?.toLocaleString() || '0'}
            icon={Calendar}
            color="indigo"
          />
          <MetricCard
            title="इस महीने उपयोगकर्ता"
            value={analytics?.users_this_month?.toLocaleString() || '0'}
            icon={TrendingUp}
            color="teal"
          />
          <MetricCard
            title="इस सप्ताह सुधार"
            value={analytics?.corrections_this_week?.toLocaleString() || '0'}
            icon={BarChart3}
            color="rose"
          />
          <MetricCard
            title="इस महीने सुधार"
            value={analytics?.corrections_this_month?.toLocaleString() || '0'}
            icon={PieChart}
            color="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnhancedUserGrowthChart />
          <UserActivityChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnhancedRevenueChart />
          <AnalyticsControlPanel />
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>प्रदर्शन अंतर्दृष्टि</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics ? ((analytics.active_subscriptions / analytics.total_users) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-sm text-blue-800 mt-1">रूपांतरण दर</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₹{analytics ? (analytics.total_revenue / (analytics.active_subscriptions || 1)).toFixed(0) : '0'}
                </div>
                <p className="text-sm text-green-800 mt-1">औसत राजस्व प्रति उपयोगकर्ता</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics ? (analytics.corrections_this_month / (analytics.users_this_month || 1)).toFixed(1) : '0'}
                </div>
                <p className="text-sm text-purple-800 mt-1">औसत सुधार प्रति उपयोगकर्ता</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default EnhancedAnalytics;
