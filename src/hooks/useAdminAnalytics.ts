
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
      // Fetch main analytics using direct SQL call
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (analyticsError) throw analyticsError;

      // Get analytics data using multiple queries
      const [
        totalUsersResult,
        usersTodayResult,
        usersWeekResult,
        usersMonthResult,
        subscriptionsResult,
        activeSubscriptionsResult,
        revenueResult,
        revenueMonthResult,
        freeUsersResult,
        premiumUsersResult,
        correctionsTodayResult,
        correctionsWeekResult,
        correctionsMonthResult
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('payment_transactions').select('amount').eq('status', 'completed'),
        supabase.from('payment_transactions').select('amount').eq('status', 'completed').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('user_subscriptions').select('*, subscription_plans!inner(plan_type)').eq('status', 'active').eq('subscription_plans.plan_type', 'free'),
        supabase.from('user_subscriptions').select('*, subscription_plans!inner(plan_type)').eq('status', 'active').neq('subscription_plans.plan_type', 'free'),
        supabase.from('user_usage').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('user_usage').select('*', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('user_usage').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const monthlyRevenue = revenueMonthResult.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

      const analyticsObj: AdminAnalytics = {
        total_users: totalUsersResult.count || 0,
        users_today: usersTodayResult.count || 0,
        users_this_week: usersWeekResult.count || 0,
        users_this_month: usersMonthResult.count || 0,
        total_subscriptions: subscriptionsResult.count || 0,
        active_subscriptions: activeSubscriptionsResult.count || 0,
        total_revenue: totalRevenue,
        revenue_this_month: monthlyRevenue,
        free_users: freeUsersResult.count || 0,
        premium_users: premiumUsersResult.count || 0,
        corrections_today: correctionsTodayResult.count || 0,
        corrections_this_week: correctionsWeekResult.count || 0,
        corrections_this_month: correctionsMonthResult.count || 0,
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
