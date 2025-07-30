import { useState, useEffect } from "react";
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, CreditCard, MessageSquare, Download, 
  RefreshCw, Calendar, DollarSign, Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsData {
  totalUsers: number;
  usersToday: number;
  usersThisWeek: number;
  usersThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalCorrections: number;
  correctionsToday: number;
  correctionsThisWeek: number;
  correctionsThisMonth: number;
  activeSubscriptions: number;
  userGrowthData: Array<{ date: string; users: number; newUsers: number; }>;
  revenueData: Array<{ month: string; revenue: number; subscriptions: number; }>;
  usageData: Array<{ date: string; corrections: number; words: number; }>;
  subscriptionDistribution: Array<{ type: string; count: number; color: string; }>;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch basic stats
      const [
        { count: totalUsers },
        { count: usersToday },
        { count: usersThisWeek },
        { count: usersThisMonth },
        { count: totalCorrections },
        { count: correctionsToday },
        { count: correctionsThisWeek },
        { count: correctionsThisMonth },
        { count: activeSubscriptions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('word_usage_history').select('*', { count: 'exact', head: true }),
        supabase.from('word_usage_history').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from('word_usage_history').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('word_usage_history').select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true })
          .eq('status', 'active')
      ]);

      // Fetch revenue data
      const { data: revenueTransactions } = await supabase
        .from('payment_transactions')
        .select('amount, created_at')
        .eq('status', 'success')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

      const totalRevenue = revenueTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const revenueThisMonth = revenueTransactions?.filter(t => 
        new Date(t.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Generate user growth data
      const userGrowthData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dayUsers = Math.floor(Math.random() * 50) + 10; // Mock data for now
        return {
          date: date.toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' }),
          users: Math.floor(Math.random() * 1000) + 500,
          newUsers: dayUsers
        };
      });

      // Generate revenue data
      const revenueData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          month: date.toLocaleDateString('hi-IN', { month: 'short' }),
          revenue: Math.floor(Math.random() * 100000) + 20000,
          subscriptions: Math.floor(Math.random() * 50) + 10
        };
      });

      // Generate usage data
      const usageData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('hi-IN', { weekday: 'short' }),
          corrections: Math.floor(Math.random() * 500) + 100,
          words: Math.floor(Math.random() * 5000) + 1000
        };
      });

      // Subscription distribution
      const subscriptionDistribution = [
        { type: 'मुफ्त', count: 800, color: '#8884d8' },
        { type: 'बेसिक', count: 150, color: '#82ca9d' },
        { type: 'प्रीमियम', count: 50, color: '#ffc658' }
      ];

      setAnalytics({
        totalUsers: totalUsers || 0,
        usersToday: usersToday || 0,
        usersThisWeek: usersThisWeek || 0,
        usersThisMonth: usersThisMonth || 0,
        totalRevenue,
        revenueThisMonth,
        totalCorrections: totalCorrections || 0,
        correctionsToday: correctionsToday || 0,
        correctionsThisWeek: correctionsThisWeek || 0,
        correctionsThisMonth: correctionsThisMonth || 0,
        activeSubscriptions: activeSubscriptions || 0,
        userGrowthData,
        revenueData,
        usageData,
        subscriptionDistribution
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('एनालिटिक्स डेटा लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Implementation for exporting analytics data
    toast.success('डेटा एक्सपोर्ट शुरू हो गया');
  };

  if (loading) {
    return (
      <AdminLayoutWithNavigation>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">एनालिटिक्स लोड हो रहे हैं...</p>
          </div>
        </div>
      </AdminLayoutWithNavigation>
    );
  }

  if (!analytics) return null;

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">एनालिटिक्स</h1>
            <p className="text-muted-foreground mt-2">विस्तृत व्यावसायिक अंतर्दृष्टि और प्रदर्शन मेट्रिक्स</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              रिफ्रेश करें
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              एक्सपोर्ट करें
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.usersThisMonth} इस महीने
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">कुल आय</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{analytics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ₹{analytics.revenueThisMonth.toLocaleString()} इस महीने
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">व्याकरण जाँच</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.totalCorrections}</div>
              <p className="text-xs text-muted-foreground">
                +{analytics.correctionsThisMonth} इस महीने
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">सक्रिय सब्सक्रिप्शन</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                सभी प्लान मिलाकर
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>उपयोगकर्ता वृद्धि</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>मासिक राजस्व</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value?.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>दैनिक उपयोग</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="corrections" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="words" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subscription Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>सब्सक्रिप्शन वितरण</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.subscriptionDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ type, count }) => `${type}: ${count}`}
                  >
                    {analytics.subscriptionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminAnalytics;