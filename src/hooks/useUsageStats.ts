
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

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
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const incrementStats = async () => {
    if (!user) return;

    try {
      await supabase.from('user_usage').insert({
        user_id: user.id,
        action_type: 'grammar_correction'
      });
      
      // Refresh stats after insertion
      await fetchStats();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  return { stats, loading, incrementStats, refetchStats: fetchStats };
};
