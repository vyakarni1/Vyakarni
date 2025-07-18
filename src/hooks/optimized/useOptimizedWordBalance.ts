
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { queryKeys } from '@/lib/queryClient';

export const useOptimizedWordBalance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: balance,
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.wordBalance(user?.id || ''),
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase.rpc('get_user_word_balance', {
        user_uuid: user.id,
      });

      if (error) throw error;
      return data?.[0] || {
        total_words_available: 0,
        free_words: 0,
        purchased_words: 0,
        topup_words: 0,
        subscription_words: 0,
        next_expiry_date: null,
        has_active_subscription: false,
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // 1 minute - balance changes more frequently
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Background update every 2 minutes
  });

  const deductWordsMutation = useMutation({
    mutationFn: async ({ 
      wordsToDeduct, 
      actionType, 
      textContent 
    }: { 
      wordsToDeduct: number; 
      actionType: string; 
      textContent?: string; 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('deduct_words', {
        user_uuid: user.id,
        words_to_deduct: wordsToDeduct,
        action_type: actionType,
        text_content: textContent || null,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch word balance
      queryClient.invalidateQueries({
        queryKey: queryKeys.wordBalance(user?.id || ''),
      });
    },
  });

  const checkWordLimit = (textLength: number): boolean => {
    return (balance?.total_words_available || 0) >= textLength;
  };

  return {
    balance: balance || {
      total_words_available: 0,
      free_words: 0,
      purchased_words: 0,
      topup_words: 0,
      subscription_words: 0,
      next_expiry_date: null,
      has_active_subscription: false,
    },
    isLoading,
    error,
    checkWordLimit,
    deductWords: deductWordsMutation.mutateAsync,
    isDeducting: deductWordsMutation.isPending,
  };
};
