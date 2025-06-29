
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

interface UsageData {
  date: string;
  words_used: number;
  action_type: string;
}

interface DailyUsage {
  date: string;
  total_words: number;
  corrections: number;
}

interface ActionTypeUsage {
  action_type: string;
  total_words: number;
  count: number;
}

const UsageAnalytics = () => {
  const { user } = useAuth();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [actionTypeUsage, setActionTypeUsage] = useState<ActionTypeUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUsageData();
    }
  }, [user]);

  const fetchUsageData = async () => {
    try {
      // Fetch last 30 days of usage
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: usageData, error } = await supabase
        .from('word_usage_history')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process daily usage
      const dailyMap = new Map<string, { total_words: number; corrections: number }>();
      
      usageData?.forEach((item) => {
        const date = new Date(item.created_at).toLocaleDateString('en-CA');
        const existing = dailyMap.get(date) || { total_words: 0, corrections: 0 };
        dailyMap.set(date, {
          total_words: existing.total_words + item.words_used,
          corrections: existing.corrections + 1
        });
      });

      const daily = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
          date: new Date(date).toLocaleDateString('hi-IN', { 
            day: 'numeric', 
            month: 'short' 
          }),
          ...data
        }))
        .slice(-14); // Last 14 days

      setDailyUsage(daily);

      // Process action type usage
      const actionMap = new Map<string, { total_words: number; count: number }>();
      
      usageData?.forEach((item) => {
        const existing = actionMap.get(item.action_type) || { total_words: 0, count: 0 };
        actionMap.set(item.action_type, {
          total_words: existing.total_words + item.words_used,
          count: existing.count + 1
        });
      });

      const actionTypes = Array.from(actionMap.entries()).map(([action_type, data]) => ({
        action_type: getActionTypeLabel(action_type),
        ...data
      }));

      setActionTypeUsage(actionTypes);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: { [key: string]: string } = {
      'grammar_check': 'व्याकरण जांच',
      'style_enhance': 'शैली सुधार',
      'spelling_check': 'वर्तनी जांच',
      'text_correction': 'पाठ सुधार'
    };
    return labels[actionType] || actionType;
  };

  const chartConfig = {
    total_words: {
      label: "शब्द",
      color: "#3b82f6",
    },
    corrections: {
      label: "सुधार",
      color: "#10b981",
    },
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>दैनिक उपयोग ट्रेंड (पिछले 14 दिन)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyUsage}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="total_words" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="शब्द"
                />
                <Line 
                  type="monotone" 
                  dataKey="corrections" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="सुधार"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Action Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>गतिविधि प्रकार वितरण</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionTypeUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ action_type, percent }) => 
                      `${action_type} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total_words"
                  >
                    {actionTypeUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Words by Action Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>गतिविधि द्वारा शब्द उपयोग</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actionTypeUsage} layout="horizontal">
                  <XAxis type="number" />
                  <YAxis dataKey="action_type" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total_words" fill="#3b82f6" name="शब्द" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageAnalytics;
