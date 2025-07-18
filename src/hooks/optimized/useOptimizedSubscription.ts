
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { queryKeys } from '@/lib/queryClient';

export const useOptimizedSubscription = () => {
  const { user } = useAuth();

  const {
    data: subscription,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.subscription(user?.id || ''),
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.rpc('get_user_subscription', {
        user_uuid: user.id,
      });

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes - subscription doesn't change often
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const isSubscriptionActive = subscription?.status === 'active' && 
    (!subscription?.expires_at || new Date(subscription.expires_at) > new Date());

  return {
    subscription,
    isSubscriptionActive,
    isLoading,
    error,
    refetch,
  };
};
