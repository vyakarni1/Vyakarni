import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Correction } from '@/types/grammarChecker';

interface TextCorrection {
  id: string;
  user_id: string;
  original_text: string;
  corrected_text: string;
  processing_type: 'grammar' | 'style';
  corrections_data: Correction[];
  words_used: number;
  created_at: string;
  updated_at: string;
}

interface SaveTextCorrectionParams {
  originalText: string;
  correctedText: string;
  processingType: 'grammar' | 'style';
  correctionsData: Correction[];
  wordsUsed: number;
}

export const useTextHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [textHistory, setTextHistory] = useState<TextCorrection[]>([]);

  const saveTextCorrection = useCallback(async (params: SaveTextCorrectionParams): Promise<string | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_corrections')
        .insert({
          user_id: user.id,
          original_text: params.originalText,
          corrected_text: params.correctedText,
          processing_type: params.processingType,
          corrections_data: params.correctionsData as any,
          words_used: params.wordsUsed,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving text correction:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in saveTextCorrection:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTextHistory = useCallback(async (limit: number = 10, offset: number = 0): Promise<TextCorrection[]> => {
    if (!user) return [];

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_corrections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching text history:', error);
        return [];
      }

      const typedData = (data || []) as unknown as TextCorrection[];
      setTextHistory(typedData);
      return typedData;
    } catch (error) {
      console.error('Error in getTextHistory:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getTextCorrectionById = useCallback(async (id: string): Promise<TextCorrection | null> => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('text_corrections')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching text correction:', error);
        return null;
      }

      return data as unknown as TextCorrection;
    } catch (error) {
      console.error('Error in getTextCorrectionById:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteTextCorrection = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('text_corrections')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting text correction:', error);
        return false;
      }

      // Update local state
      setTextHistory(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error('Error in deleteTextCorrection:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    textHistory,
    saveTextCorrection,
    getTextHistory,
    getTextCorrectionById,
    deleteTextCorrection,
  };
};