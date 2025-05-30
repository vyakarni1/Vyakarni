
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BulkActionParams } from '@/types/userManagement';

export const useBulkOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userIds, action, value }: BulkActionParams) => {
      if (action === 'add_credits' || action === 'deduct_credits') {
        const amount = value.amount;
        const reason = value.reason;
        const isFree = value.is_free;
        const expiryDate = value.expiry_date;

        if (action === 'add_credits') {
          // Add credits to selected users
          const creditEntries = userIds.map(userId => ({
            user_id: userId,
            words_available: amount,
            words_purchased: amount,
            is_free_credit: isFree,
            expiry_date: expiryDate,
            purchase_date: new Date().toISOString(),
          }));

          const { error } = await supabase
            .from('user_word_credits')
            .insert(creditEntries);
          if (error) throw error;
        } else {
          // Deduct credits (implementation needed based on requirements)
          throw new Error('Credit deduction not implemented yet');
        }
      } else if (action === 'assign_role') {
        // Update user roles
        const roleEntries = userIds.map(userId => ({
          user_id: userId,
          role: value.role,
        }));

        // Delete existing roles first
        await supabase
          .from('user_roles')
          .delete()
          .in('user_id', userIds);

        // Insert new roles
        const { error } = await supabase
          .from('user_roles')
          .insert(roleEntries);
        if (error) throw error;
      } else if (action === 'delete') {
        // Delete users (this will cascade to related data)
        const { error } = await supabase
          .from('profiles')
          .delete()
          .in('id', userIds);
        if (error) throw error;
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
