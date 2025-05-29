
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAnalytics {
  total_users: number;
  users_today: number;
  users_this_week: number;
  users_this_month: number;
  total_subscriptions: number;
  active_subscriptions: number;
  total_revenue: number;
  revenue_this_month: number;
  free_users: number;
  premium_users: number;
  corrections_today: number;
  corrections_this_week: number;
  corrections_this_month: number;
}

interface UserGrowthData {
  date: string;
  new_users: number;
  total_users: number;
}

interface SubscriptionDistribution {
  plan_name: string;
  plan_type: string;
  user_count: number;
  revenue: number;
}

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [subscriptionDist, setSubscriptionDist] = useState<SubscriptionDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Fetch main analytics
      const { data: analyticsData, error: analyticsError } = await supabase.rpc('get_admin_analytics');
      if (analyticsError) throw analyticsError;
      
      if (analyticsData && analyticsData.length > 0) {
        setAnalytics(analyticsData[0]);
      }

      // Fetch user growth data
      const { data: growthData, error: growthError } = await supabase.rpc('get_user_growth_data', { days_back: 30 });
      if (growthError) throw growthError;
      
      setUserGrowth(growthData || []);

      // Fetch subscription distribution
      const { data: distData, error: distError } = await supabase.rpc('get_subscription_distribution');
      if (distError) throw distError;
      
      setSubscriptionDist(distData || []);
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time updates
    const channel = supabase
      .channel('admin-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchAnalytics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_subscriptions' }, fetchAnalytics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_usage' }, fetchAnalytics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_transactions' }, fetchAnalytics)
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { analytics, userGrowth, subscriptionDist, loading, refetch: fetchAnalytics };
};
