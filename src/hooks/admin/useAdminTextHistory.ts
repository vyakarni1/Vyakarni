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
    params: {
      userId?: string;
      search?: string;
      processingType?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      userEmail?: string;
      page?: number;
      limit?: number;
      append?: boolean;
    } = {}
  ): Promise<AdminTextCorrection[]> => {
    try {
      console.log('useAdminTextHistory: Fetching corrections with params:', params);
      console.log('useAdminTextHistory: Current user:', await supabase.auth.getUser());
      setLoading(true);
      
      // Check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      console.log('useAdminTextHistory: Current user ID:', user?.id);
      
      // Check admin status
      const { data: adminCheck } = await supabase
        .rpc('is_admin', { _user_id: user?.id });
      console.log('useAdminTextHistory: Is admin?', adminCheck);
      
      let query = supabase
        .from('text_corrections')
        .select(`
          *,
          profiles(name, email)
        `, { count: 'exact' });

      // Apply filters
      if (params.userId) {
        query = query.eq('user_id', params.userId);
      }

      if (params.processingType && params.processingType !== 'all') {
        query = query.eq('processing_type', params.processingType);
      }

      if (params.search) {
        query = query.or(`original_text.ilike.%${params.search}%,corrected_text.ilike.%${params.search}%`);
      }

      if (params.userEmail) {
        // First get user IDs matching the email
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', `%${params.userEmail}%`);
        
        if (users && users.length > 0) {
          const userIds = users.map(u => u.id);
          query = query.in('user_id', userIds);
        } else {
          // No users found, return empty
          console.log('useAdminTextHistory: No users found for email:', params.userEmail);
          if (params.append) {
            // Don't modify existing data if appending
          } else {
            setCorrections([]);
            setTotalCount(0);
          }
          return [];
        }
      }

      if (params.startDate) {
        query = query.gte('created_at', params.startDate);
      }

      if (params.endDate) {
        query = query.lte('created_at', params.endDate);
      }

      // Apply sorting
      const sortOrder = params.sortBy === 'oldest' ? { ascending: true } : { ascending: false };
      if (params.sortBy === 'most_words') {
        query = query.order('words_used', { ascending: false });
      } else if (params.sortBy === 'most_corrections') {
        query = query.order('corrections_data->0', { ascending: false });
      } else {
        query = query.order('created_at', sortOrder);
      }

      // Apply pagination
      const page = params.page || 0;
      const limit = params.limit || 20;
      const offset = page * limit;
      
      console.log('useAdminTextHistory: Executing query...');
      const { data, error, count } = await query
        .range(offset, offset + limit - 1);

      console.log('useAdminTextHistory: Query executed. Error:', error);
      console.log('useAdminTextHistory: Data received:', data);
      console.log('useAdminTextHistory: Count:', count);

      if (error) {
        console.error('useAdminTextHistory: Error fetching text corrections:', error);
        // Try a simple query without joins to test RLS
        console.log('useAdminTextHistory: Trying simple query without joins...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('text_corrections')
          .select('*')
          .limit(5);
        console.log('useAdminTextHistory: Simple query result:', simpleData, simpleError);
        return [];
      }

      console.log('useAdminTextHistory: Raw data received:', data);
      console.log('useAdminTextHistory: Found corrections:', data?.length, 'total count:', count);
      
      if (!params.append) {
        setTotalCount(count || 0);
      }
      
      const typedData = (data || []).map(item => ({
        ...item,
        corrections_data: (item.corrections_data as any) || [],
        user_name: (item as any).profiles?.name,
        user_email: (item as any).profiles?.email,
      })) as AdminTextCorrection[];
      
      console.log('useAdminTextHistory: Processed corrections data:', typedData.length, 'items');
      console.log('useAdminTextHistory: First item example:', typedData[0]);
      
      if (params.append) {
        console.log('useAdminTextHistory: Appending to existing corrections');
        setCorrections(prev => {
          const newData = [...prev, ...typedData];
          console.log('useAdminTextHistory: New total after append:', newData.length);
          return newData;
        });
      } else {
        console.log('useAdminTextHistory: Setting new corrections data');
        setCorrections(typedData);
      }
      return typedData;
    } catch (error) {
      console.error('useAdminTextHistory: Error in getTextCorrections:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCorrectionStats = useCallback(async (params: {
    userId?: string;
    startDate?: string;
    endDate?: string;
    processingType?: string;
  } = {}) => {
    try {
      let query = supabase
        .from('text_corrections')
        .select('processing_type, words_used, created_at');

      if (params.userId) {
        query = query.eq('user_id', params.userId);
      }

      if (params.processingType && params.processingType !== 'all') {
        query = query.eq('processing_type', params.processingType);
      }

      if (params.startDate) {
        query = query.gte('created_at', params.startDate);
      }

      if (params.endDate) {
        query = query.lte('created_at', params.endDate);
      }

      const { data, error } = await query;

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