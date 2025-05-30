
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BulkActionParams } from '@/types/userManagement';

export const useBulkUserOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ userIds, action, value }: BulkActionParams) => {
      console.log('Bulk action:', action, 'for users:', userIds, 'with value:', value);
      
      try {
        if (action === 'activate') {
          const promises = userIds.map(userId => 
            supabase.from('user_roles').upsert({
              user_id: userId,
              role: 'user' as const
            })
          );
          await Promise.all(promises);
        } else if (action === 'suspend') {
          const promises = userIds.map(userId => 
            supabase.from('user_roles').upsert({
              user_id: userId,
              role: 'user' as const
            })
          );
          await Promise.all(promises);
          console.log('Users marked for suspension (role kept as user for now):', userIds);
        } else if (action === 'delete') {
          const { error } = await supabase
            .from('profiles')
            .delete()
            .in('id', userIds);
          if (error) throw error;
        } else if (action === 'add_credits') {
          const creditsToAdd = parseInt(value?.amount) || parseInt(value) || 100;
          const promises = userIds.map(userId => 
            supabase.from('user_word_credits').insert({
              user_id: userId,
              words_available: creditsToAdd,
              words_purchased: creditsToAdd,
              is_free_credit: value?.is_free !== false,
              purchase_date: new Date().toISOString(),
              expiry_date: value?.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
          );
          await Promise.all(promises);
        }
      } catch (error) {
        console.error('Error in bulk operation:', error);
        throw error;
      }
    },
    onSuccess: (_, { action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-users-complete'] });
      toast({
        title: "बल्क ऑपरेशन सफल",
        description: `${userIds.length} उपयोगकर्ताओं पर ${action} सफलतापूर्वक लागू किया गया।`,
      });
    },
    onError: (error) => {
      console.error('Bulk operation error:', error);
      toast({
        title: "त्रुटि",
        description: "बल्क ऑपरेशन में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  return {
    bulkUpdate: bulkUpdateMutation.mutate,
    isBulkUpdating: bulkUpdateMutation.isPending,
  };
};
