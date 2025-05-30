
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  target_audience: 'all' | 'admins' | 'users';
  is_read: boolean;
  created_by: string;
  expires_at?: string;
  created_at: string;
}

interface CreateNotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  target_audience: 'all' | 'admins' | 'users';
  expires_at?: string;
}

export const useSystemNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch system notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['system-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SystemNotification[];
    },
    enabled: !!user,
  });

  // Create notification
  const createNotificationMutation = useMutation({
    mutationFn: async (notificationData: CreateNotificationData) => {
      const { data, error } = await supabase
        .from('system_notifications')
        .insert({
          ...notificationData,
          created_by: user?.id,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: "अधिसूचना बनाई गई",
        description: "नई सिस्टम अधिसूचना सफलतापूर्वक बनाई गई।",
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "अधिसूचना बनाने में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('system_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('system_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: "अधिसूचना हटाई गई",
        description: "अधिसूचना सफलतापूर्वक हटाई गई।",
      });
    },
    onError: () => {
      toast({
        title: "त्रुटि",
        description: "अधिसूचना हटाने में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  // Real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('system-notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'system_notifications',
          filter: `target_audience=in.(all,admins)`
        }, 
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
          
          // Show toast for new notifications
          if (payload.new) {
            const notification = payload.new as SystemNotification;
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.type === 'error' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast]);

  // Update unread count
  useEffect(() => {
    if (notifications) {
      const unread = notifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('system_notifications')
        .update({ is_read: true })
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-notifications'] });
      toast({
        title: "सभी पढ़ी गईं",
        description: "सभी अधिसूचनाएं पढ़ी गई के रूप में चिह्नित की गईं।",
      });
    },
  });

  // Broadcast notification to all users
  const broadcastNotification = async (notification: CreateNotificationData) => {
    await createNotificationMutation.mutateAsync(notification);
    
    // Here you could also send email notifications, push notifications, etc.
    // For now, we'll just create the system notification
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    createNotification: createNotificationMutation.mutate,
    isCreating: createNotificationMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeleting: deleteNotificationMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    broadcastNotification,
  };
};
