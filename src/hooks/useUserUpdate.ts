
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserWithDetails } from '@/types/userManagement';

export const useUserUpdate = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<UserWithDetails> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advanced-users'] });
      toast({
        title: "अपडेट सफल",
        description: "उपयोगकर्ता की जानकारी अपडेट हो गई।",
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "उपयोगकर्ता अपडेट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });
};
