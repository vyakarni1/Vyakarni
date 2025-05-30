
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAnalytics {
  total_users: number;
  users_today: number;
  users_this_week: number;
  users_this_month: number;
  active_subscriptions: number;
  total_revenue: number;
  revenue_this_month: number;
  corrections_today: number;
  corrections_this_week: number;
  corrections_this_month: number;
  user_growth_rate: number;
  revenue_growth_rate: number;
  churn_rate: number;
  avg_session_duration: number;
}

interface UserGrowthData {
  date: string;
  new_users: number;
  total_users: number;
  active_users: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
  avg_transaction_value: number;
}

interface UserActivity {
  user_id: string;
  user_name: string;
  last_login: string;
  corrections_count: number;
  subscription_status: string;
  words_used: number;
}

export const useEnhancedAdminAnalytics = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch enhanced analytics with caching
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['enhanced-admin-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cached_analytics');
      if (error) throw error;
      return data as EnhancedAnalytics;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch user growth data
  const { data: userGrowth, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (error) throw error;

      // Process data into daily growth
      const growthData: UserGrowthData[] = [];
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      last30Days.forEach(date => {
        const newUsers = data?.filter(user => 
          user.created_at.startsWith(date)
        ).length || 0;
        
        const totalUsers = data?.filter(user => 
          user.created_at <= date + 'T23:59:59'
        ).length || 0;

        growthData.push({
          date,
          new_users: newUsers,
          total_users: totalUsers,
          active_users: Math.floor(totalUsers * 0.7), // Simulated active users
        });
      });

      return growthData;
    },
  });

  // Fetch revenue data
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      if (error) throw error;

      // Process into daily revenue
      const revenueByDay: { [key: string]: { revenue: number; transactions: number } } = {};
      
      data?.forEach(transaction => {
        const date = transaction.created_at.split('T')[0];
        if (!revenueByDay[date]) {
          revenueByDay[date] = { revenue: 0, transactions: 0 };
        }
        revenueByDay[date].revenue += Number(transaction.amount);
        revenueByDay[date].transactions += 1;
      });

      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      return last30Days.map(date => ({
        date,
        revenue: revenueByDay[date]?.revenue || 0,
        transactions: revenueByDay[date]?.transactions || 0,
        avg_transaction_value: revenueByDay[date] 
          ? revenueByDay[date].revenue / revenueByDay[date].transactions 
          : 0,
      }));
    },
  });

  // Fetch recent user activity
  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          created_at,
          user_subscriptions!inner(status),
          word_usage_history(words_used)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      return profiles?.map(profile => ({
        user_id: profile.id,
        user_name: profile.name,
        last_login: profile.created_at,
        corrections_count: profile.word_usage_history?.length || 0,
        subscription_status: profile.user_subscriptions?.[0]?.status || 'free',
        words_used: profile.word_usage_history?.reduce((sum, usage) => sum + (usage.words_used || 0), 0) || 0,
      })) as UserActivity[];
    },
  });

  // Real-time subscription for analytics updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-analytics-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        queryClient.invalidateQueries({ queryKey: ['enhanced-admin-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['user-growth-data'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_transactions' }, () => {
        queryClient.invalidateQueries({ queryKey: ['enhanced-admin-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['revenue-data'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'word_usage_history' }, () => {
        queryClient.invalidateQueries({ queryKey: ['enhanced-admin-analytics'] });
        queryClient.invalidateQueries({ queryKey: ['user-activity'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const exportAnalytics = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const exportData = {
        analytics,
        userGrowth,
        revenueData,
        userActivity,
        exportDate: new Date().toISOString(),
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Convert to CSV format
        const csvContent = [
          'Metric,Value',
          `Total Users,${analytics?.total_users || 0}`,
          `Users Today,${analytics?.users_today || 0}`,
          `Active Subscriptions,${analytics?.active_subscriptions || 0}`,
          `Total Revenue,${analytics?.total_revenue || 0}`,
          `Revenue This Month,${analytics?.revenue_this_month || 0}`,
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "एक्सपोर्ट सफल",
        description: `एनालिटिक्स डेटा ${format.toUpperCase()} फॉर्मेट में डाउनलोड हो गया।`,
      });
    } catch (error) {
      toast({
        title: "एक्सपोर्ट त्रुटि",
        description: "डेटा एक्सपोर्ट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    }
  };

  return {
    analytics,
    userGrowth,
    revenueData,
    userActivity,
    isLoading: analyticsLoading || userGrowthLoading || revenueLoading || activityLoading,
    exportAnalytics,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-admin-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['user-growth-data'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-data'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity'] });
    },
  };
};
