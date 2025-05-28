
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  totalCorrections: number;
  correctionsToday: number;
  correctionsThisWeek: number;
  correctionsThisMonth: number;
}

export const useUsageStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats>({
    totalCorrections: 0,
    correctionsToday: 0,
    correctionsThisWeek: 0,
    correctionsThisMonth: 0,
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
        const statsData = data[0];
        setStats({
          totalCorrections: statsData.total_corrections || 0,
          correctionsToday: statsData.corrections_today || 0,
          correctionsThisWeek: statsData.corrections_this_week || 0,
          correctionsThisMonth: statsData.corrections_this_month || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('usage-stats')
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
  }, [user]);

  const trackUsage = async (actionType: string) => {
    if (!user) return;
    
    try {
      await supabase.from('user_usage').insert({
        user_id: user.id,
        action_type: actionType
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  return { stats, loading, trackUsage };
};
