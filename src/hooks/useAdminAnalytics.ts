
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
      // Fetch main analytics using the secure function
      const { data: secureAnalytics, error: secureError } = await supabase
        .rpc('get_admin_analytics_summary')
        .single();

      if (secureError) throw secureError;

      // Get additional data for features not in the main function
      const [
        freeUsersResult,
        premiumUsersResult
      ] = await Promise.all([
        supabase.from('user_subscriptions').select('*, subscription_plans!inner(plan_type)', { count: 'exact', head: true }).eq('status', 'active').eq('subscription_plans.plan_type', 'free'),
        supabase.from('user_subscriptions').select('*, subscription_plans!inner(plan_type)', { count: 'exact', head: true }).eq('status', 'active').neq('subscription_plans.plan_type', 'free')
      ]);

      const analyticsObj: AdminAnalytics = {
        total_users: Number(secureAnalytics?.total_users) || 0,
        users_today: Number(secureAnalytics?.users_today) || 0,
        users_this_week: Number(secureAnalytics?.users_this_week) || 0,
        users_this_month: Number(secureAnalytics?.users_this_month) || 0,
        total_subscriptions: Number(secureAnalytics?.active_subscriptions) || 0,
        active_subscriptions: Number(secureAnalytics?.active_subscriptions) || 0,
        total_revenue: Number(secureAnalytics?.total_revenue) || 0,
        revenue_this_month: Number(secureAnalytics?.revenue_this_month) || 0,
        free_users: freeUsersResult.count || 0,
        premium_users: premiumUsersResult.count || 0,
        corrections_today: Number(secureAnalytics?.corrections_today) || 0,
        corrections_this_week: Number(secureAnalytics?.corrections_this_week) || 0,
        corrections_this_month: Number(secureAnalytics?.corrections_this_month) || 0,
      };

      setAnalytics(analyticsObj);

      // Fetch user growth data (simplified)
      const { data: growthData } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at');

      // Process growth data
      const growth: UserGrowthData[] = [];
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      last30Days.forEach(date => {
        const newUsers = growthData?.filter(user => 
          user.created_at.startsWith(date)
        ).length || 0;
        
        growth.push({
          date,
          new_users: newUsers,
          total_users: growthData?.filter(user => 
            user.created_at <= date + 'T23:59:59'
          ).length || 0
        });
      });

      setUserGrowth(growth);

      // Fetch subscription distribution
      const { data: distData } = await supabase
        .from('subscription_plans')
        .select(`
          plan_name,
          plan_type,
          user_subscriptions!inner(status),
          payment_transactions(amount)
        `);

      const distribution: SubscriptionDistribution[] = distData?.map(plan => ({
        plan_name: plan.plan_name,
        plan_type: plan.plan_type,
        user_count: plan.user_subscriptions?.length || 0,
        revenue: 0 // Simplified for now
      })) || [];

      setSubscriptionDist(distribution);

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
