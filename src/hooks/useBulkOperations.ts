
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBulkOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds, action, value }: { userIds: string[]; action: string; value?: any }) => {
      if (action === 'suspend') {
        // Update user role to user (cannot use 'suspended' as it's not in the enum)
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_roles')
            .update({ role: 'user' })
            .eq('user_id', userId);
          if (error) throw error;
        }
      } else if (action === 'activate') {
        // Update user role to user
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_roles')
            .upsert({ user_id: userId, role: 'user' }, { onConflict: 'user_id' });
          if (error) throw error;
        }
      } else if (action === 'delete') {
        // Delete users (cascade will handle related data)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', userIds);
        if (error) throw error;
      } else if (action === 'add_credits') {
        // Add word credits to users
        const wordsToAdd = value || 100;
        for (const userId of userIds) {
          const { error } = await supabase
            .from('user_word_credits')
            .insert({
              user_id: userId,
              words_available: wordsToAdd,
              words_purchased: wordsToAdd,
              is_free_credit: true,
            });
          if (error) throw error;
        }
      } else if (action === 'deduct_credits') {
        // Deduct word credits from users
        const wordsToDeduct = value?.amount || 100;
        for (const userId of userIds) {
          // Get user's current credits
          const { data: credits } = await supabase
            .from('user_word_credits')
            .select('*')
            .eq('user_id', userId)
            .gt('words_available', 0)
            .order('created_at', { ascending: true });

          if (credits && credits.length > 0) {
            let remaining = wordsToDeduct;
            for (const credit of credits) {
              if (remaining <= 0) break;
              const deduct = Math.min(credit.words_available, remaining);
              await supabase
                .from('user_word_credits')
                .update({ words_available: credit.words_available - deduct })
                .eq('id', credit.id);
              remaining -= deduct;
            }
          }
        }
      }
    },
    onSuccess: (_, { action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: ['advanced-users'] });
      toast({
        title: "बल्क ऑपरेशन सफल",
        description: `${userIds.length} उपयोगकर्ताओं पर ${action} सफलतापूर्वक लागू किया गया।`,
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "बल्क ऑपरेशन में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });
};
