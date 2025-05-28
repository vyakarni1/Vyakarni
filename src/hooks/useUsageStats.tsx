
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  total_corrections: number;
  corrections_today: number;
  corrections_this_week: number;
  corrections_this_month: number;
}

export const useUsageStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats>({
    total_corrections: 0,
    corrections_today: 0,
    corrections_this_week: 0,
    corrections_this_month: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackUsage = async (actionType: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_usage')
        .insert({
          user_id: user.id,
          action_type: actionType
        });
      
      if (error) throw error;
      
      // Refresh stats after tracking
      await fetchStats();
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_usage',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return { stats, loading, trackUsage };
};
