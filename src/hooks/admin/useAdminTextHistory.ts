import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Correction } from '@/types/grammarChecker';

interface AdminTextCorrection {
  id: string;
  user_id: string;
  original_text: string;
  corrected_text: string;
  processing_type: 'grammar' | 'style';
  corrections_data: Correction[];
  words_used: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

interface CorrectionFilters {
  search: string;
  processing_type: 'all' | 'grammar' | 'style';
  date_range: 'all' | 'today' | 'week' | 'month';
  min_words: number;
  max_words: number;
}

export const useAdminTextHistory = () => {
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState<AdminTextCorrection[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const getTextCorrections = useCallback(async (
    userId: string,
    filters: CorrectionFilters = {
      search: '',
      processing_type: 'all',
      date_range: 'all',
      min_words: 0,
      max_words: 1000000
    },
    limit: number = 20,
    offset: number = 0
  ): Promise<AdminTextCorrection[]> => {
    try {
      console.log('Fetching corrections for user:', userId, 'with filters:', filters);
      setLoading(true);
      
      let query = supabase
        .from('text_corrections')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.processing_type !== 'all') {
        query = query.eq('processing_type', filters.processing_type);
      }

      if (filters.search) {
        query = query.or(`original_text.ilike.%${filters.search}%,corrected_text.ilike.%${filters.search}%`);
      }

      if (filters.date_range !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (filters.date_range) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }

      if (filters.min_words > 0) {
        query = query.gte('words_used', filters.min_words);
      }

      if (filters.max_words < 1000000) {
        query = query.lte('words_used', filters.max_words);
      }

      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching text corrections:', error);
        return [];
      }

      console.log('Found corrections:', data?.length, 'total count:', count);
      setTotalCount(count || 0);
      
      // Get user profile separately
      const userProfile = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', userId)
        .single();
      
      const typedData = (data || []).map(item => ({
        ...item,
        corrections_data: (item.corrections_data as any) || [],
        user_name: userProfile.data?.name,
        user_email: userProfile.data?.email,
      })) as AdminTextCorrection[];
      
      console.log('Processed corrections data:', typedData);
      setCorrections(typedData);
      return typedData;
    } catch (error) {
      console.error('Error in getTextCorrections:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCorrectionStats = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('text_corrections')
        .select('processing_type, words_used, created_at')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching correction stats:', error);
        return null;
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        total_corrections: data.length,
        total_words: data.reduce((sum, item) => sum + item.words_used, 0),
        grammar_corrections: data.filter(item => item.processing_type === 'grammar').length,
        style_corrections: data.filter(item => item.processing_type === 'style').length,
        corrections_today: data.filter(item => new Date(item.created_at) >= today).length,
        corrections_this_week: data.filter(item => new Date(item.created_at) >= weekAgo).length,
        corrections_this_month: data.filter(item => new Date(item.created_at) >= monthAgo).length,
        avg_words_per_correction: data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.words_used, 0) / data.length) : 0,
      };

      return stats;
    } catch (error) {
      console.error('Error in getCorrectionStats:', error);
      return null;
    }
  }, []);

  return {
    loading,
    corrections,
    totalCount,
    getTextCorrections,
    getCorrectionStats,
  };
};