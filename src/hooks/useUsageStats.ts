
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface UsageStats {
  total_corrections: number;
  corrections_today: number;
  corrections_this_week: number;
  corrections_this_month: number;
  words_used_today: number;
  words_used_this_week: number;
  words_used_this_month: number;
  total_words_used: number;
}

export const useUsageStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats>({
    total_corrections: 0,
    corrections_today: 0,
    corrections_this_week: 0,
    corrections_this_month: 0,
    words_used_today: 0,
    words_used_this_week: 0,
    words_used_this_month: 0,
    total_words_used: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get correction stats from existing RPC function
      const { data: correctionData, error: correctionError } = await supabase.rpc('get_user_stats', {
        user_uuid: user.id,
      });

      if (correctionError) {
        console.error('Error fetching correction stats:', correctionError);
      }

      // Get word usage stats from word_usage_history
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      // Words used today
      const { data: wordsToday, error: todayError } = await supabase
        .from('word_usage_history')
        .select('words_used')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      // Words used this week
      const { data: wordsThisWeek, error: weekError } = await supabase
        .from('word_usage_history')
        .select('words_used')
        .eq('user_id', user.id)
        .gte('created_at', thisWeekStart.toISOString());

      // Words used this month
      const { data: wordsThisMonth, error: monthError } = await supabase
        .from('word_usage_history')
        .select('words_used')
        .eq('user_id', user.id)
        .gte('created_at', thisMonthStart.toISOString());

      // Total words used
      const { data: totalWords, error: totalError } = await supabase
        .from('word_usage_history')
        .select('words_used')
        .eq('user_id', user.id);

      if (todayError || weekError || monthError || totalError) {
        console.error('Error fetching word usage stats:', { todayError, weekError, monthError, totalError });
      }

      // Calculate totals
      const wordsUsedToday = wordsToday?.reduce((sum, record) => sum + record.words_used, 0) || 0;
      const wordsUsedThisWeek = wordsThisWeek?.reduce((sum, record) => sum + record.words_used, 0) || 0;
      const wordsUsedThisMonth = wordsThisMonth?.reduce((sum, record) => sum + record.words_used, 0) || 0;
      const totalWordsUsed = totalWords?.reduce((sum, record) => sum + record.words_used, 0) || 0;

      console.log('Word usage stats:', {
        wordsUsedToday,
        wordsUsedThisWeek,
        wordsUsedThisMonth,
        totalWordsUsed
      });

      setStats({
        total_corrections: correctionData?.[0]?.total_corrections || 0,
        corrections_today: correctionData?.[0]?.corrections_today || 0,
        corrections_this_week: correctionData?.[0]?.corrections_this_week || 0,
        corrections_this_month: correctionData?.[0]?.corrections_this_month || 0,
        words_used_today: wordsUsedToday,
        words_used_this_week: wordsUsedThisWeek,
        words_used_this_month: wordsUsedThisMonth,
        total_words_used: totalWordsUsed,
      });
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackUsage = async (actionType: string) => {
    if (!user) return;

    try {
      await supabase.from('user_usage').insert({
        user_id: user.id,
        action_type: actionType,
      });
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchStats();

    // Set up real-time subscription for both tables
    const channel = supabase
      .channel('usage-stats')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_usage',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStats(); // Refetch stats when new usage is tracked
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'word_usage_history',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStats(); // Refetch stats when new word usage is tracked
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { stats, loading, trackUsage };
};
