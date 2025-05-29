
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SubscriptionStats {
  total: number;
  active: number;
  cancelled: number;
  expired: number;
  revenue: number;
}

interface SubscriptionWithUser {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  plan_name: string;
  plan_type: string;
  status: string;
  amount: number;
  created_at: string;
  expires_at: string | null;
  billing_cycle: string;
}

interface SubscriptionFilters {
  status?: string;
  plan?: string;
  search?: string;
}

const useSubscriptionManagement = () => {
  const queryClient = useQueryClient();

  // Fetch subscription statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async (): Promise<SubscriptionStats> => {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select(`
          id,
          status,
          billing_cycle,
          subscription_plans!inner(price_monthly, price_yearly)
        `);

      if (error) throw error;

      const total = subscriptions.length;
      const active = subscriptions.filter(s => s.status === 'active').length;
      const cancelled = subscriptions.filter(s => s.status === 'cancelled').length;
      const expired = subscriptions.filter(s => s.status === 'expired').length;

      // Calculate revenue based on billing cycle
      const revenue = subscriptions.reduce((sum, sub) => {
        if (sub.status === 'active') {
          const plan = sub.subscription_plans;
          const price = sub.billing_cycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
          return sum + Number(price);
        }
        return sum;
      }, 0);

      return { total, active, cancelled, expired, revenue };
    },
  });

  // Fetch subscriptions with user details
  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async (): Promise<SubscriptionWithUser[]> => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          id,
          user_id,
          status,
          billing_cycle,
          created_at,
          expires_at,
          profiles!inner(name),
          subscription_plans!inner(
            plan_name,
            plan_type,
            price_monthly,
            price_yearly
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users (requires service role or proper RLS)
      const userIds = data.map(sub => sub.user_id);
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      const emailMap = new Map();
      if (!authError && authUsers?.users) {
        authUsers.users.forEach(user => {
          emailMap.set(user.id, user.email);
        });
      }

      return data.map(sub => ({
        id: sub.id,
        user_id: sub.user_id,
        user_name: sub.profiles.name,
        email: emailMap.get(sub.user_id) || 'N/A',
        plan_name: sub.subscription_plans.plan_name,
        plan_type: sub.subscription_plans.plan_type,
        status: sub.status,
        amount: sub.billing_cycle === 'yearly' 
          ? Number(sub.subscription_plans.price_yearly)
          : Number(sub.subscription_plans.price_monthly),
        created_at: sub.created_at,
        expires_at: sub.expires_at,
        billing_cycle: sub.billing_cycle,
      }));
    },
  });

  // Filter subscriptions
  const getFilteredSubscriptions = (filters: SubscriptionFilters) => {
    if (!subscriptions) return [];

    return subscriptions.filter(sub => {
      if (filters.status && filters.status !== 'all' && sub.status !== filters.status) {
        return false;
      }
      if (filters.plan && filters.plan !== 'all' && sub.plan_type.toLowerCase() !== filters.plan.toLowerCase()) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          sub.user_name.toLowerCase().includes(searchLower) ||
          sub.email.toLowerCase().includes(searchLower) ||
          sub.plan_name.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  // Update subscription status
  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      toast({
        title: "सफलता",
        description: "सब्सक्रिप्शन स्थिति अपडेट हो गई",
      });
    },
    onError: (error) => {
      toast({
        title: "त्रुटि",
        description: "सब्सक्रिप्शन अपडेट करने में समस्या",
        variant: "destructive",
      });
      console.error('Error updating subscription:', error);
    },
  });

  // Export subscriptions data
  const exportSubscriptions = async (subscriptions: SubscriptionWithUser[]) => {
    try {
      const csvData = [
        ['User Name', 'Email', 'Plan', 'Status', 'Amount', 'Created', 'Expires'],
        ...subscriptions.map(sub => [
          sub.user_name,
          sub.email,
          sub.plan_name,
          sub.status,
          `₹${sub.amount}`,
          new Date(sub.created_at).toLocaleDateString('hi-IN'),
          sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('hi-IN') : 'N/A'
        ])
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "सफलता",
        description: "सब्सक्रिप्शन डेटा एक्सपोर्ट हो गया",
      });
    } catch (error) {
      toast({
        title: "त्रुटि",
        description: "एक्सपोर्ट करने में समस्या",
        variant: "destructive",
      });
      console.error('Export error:', error);
    }
  };

  return {
    stats,
    statsLoading,
    subscriptions,
    subscriptionsLoading,
    getFilteredSubscriptions,
    updateSubscription: updateSubscriptionMutation.mutate,
    isUpdating: updateSubscriptionMutation.isPending,
    exportSubscriptions,
  };
};

export default useSubscriptionManagement;
