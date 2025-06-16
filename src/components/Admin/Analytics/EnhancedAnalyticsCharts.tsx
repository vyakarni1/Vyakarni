
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { useEnhancedAdminAnalytics } from '@/hooks/useEnhancedAdminAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EnhancedUserGrowthChart = () => {
  const { userGrowth, isLoading } = useEnhancedAdminAnalytics();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const latestGrowth = userGrowth?.[userGrowth.length - 1];
  const previousGrowth = userGrowth?.[userGrowth.length - 2];
  const growthRate = latestGrowth && previousGrowth 
    ? ((latestGrowth.new_users - previousGrowth.new_users) / (previousGrowth.new_users || 1)) * 100
    : 0;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            उपयोगकर्ता वृद्धि ट्रेंड
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={growthRate >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
              {growthRate >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(growthRate).toFixed(1)}%
            </Badge>
            <span className="text-sm text-gray-600">पिछले दिन से</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('hi-IN')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('hi-IN')}
              formatter={(value, name) => [
                value,
                name === 'new_users' ? 'नये उपयोगकर्ता' : 
                name === 'total_users' ? 'कुल उपयोगकर्ता' : 'सक्रिय उपयोगकर्ता'
              ]}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="new_users" 
              stackId="1" 
              stroke="#8884d8" 
              fill="#8884d8" 
              name="नए उपयोगकर्ता"
            />
            <Area 
              type="monotone" 
              dataKey="active_users" 
              stackId="1" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="सक्रिय उपयोगकर्ता"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const EnhancedRevenueChart = () => {
  const { revenueData, isLoading } = useEnhancedAdminAnalytics();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = revenueData?.reduce((sum, day) => sum + day.revenue, 0) || 0;
  const avgDailyRevenue = totalRevenue / (revenueData?.length || 1);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            राजस्व विश्लेषण
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-sm">
              <span className="text-gray-600">कुल राजस्व: </span>
              <span className="font-semibold">₹{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">औसत दैनिक: </span>
              <span className="font-semibold">₹{avgDailyRevenue.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('hi-IN')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('hi-IN')}
              formatter={(value, name) => [
                name === 'revenue' ? `₹${value}` : value,
                name === 'revenue' ? 'राजस्व' : 
                name === 'transactions' ? 'लेनदेन' : 'औसत लेनदेन मूल्य'
              ]}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="राजस्व" />
            <Bar dataKey="transactions" fill="#82ca9d" name="लेनदेन संख्या" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const UserActivityChart = () => {
  const { userActivity, isLoading } = useEnhancedAdminAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Group users by subscription status for pie chart
  const subscriptionData = userActivity?.reduce((acc, user) => {
    const status = user.subscription_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(subscriptionData || {}).map(([key, value], index) => ({
    name: key === 'active' ? 'सक्रिय' : key === 'free' ? 'नि:शुल्क' : key,
    value,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          सब्सक्रिप्शन वितरण
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const AnalyticsControlPanel = () => {
  const { exportAnalytics, refetch, isLoading } = useEnhancedAdminAnalytics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>एनालिटिक्स नियंत्रण</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => exportAnalytics('csv')} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV एक्सपोर्ट
          </Button>
          <Button 
            onClick={() => exportAnalytics('json')} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            JSON एक्सपोर्ट
          </Button>
        </div>
        <Button 
          onClick={refetch} 
          disabled={isLoading}
          className="w-full flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          डेटा रीफ्रेश करें
        </Button>
      </CardContent>
    </Card>
  );
};

export {
  EnhancedUserGrowthChart,
  EnhancedRevenueChart,
  UserActivityChart,
  AnalyticsControlPanel
};
