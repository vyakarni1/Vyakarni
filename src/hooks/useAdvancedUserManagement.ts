
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface UserWithDetails {
  id: string;
  name: string;
  created_at: string;
  role: UserRole;
  plan_name: string;
  plan_type: string;
  subscription_status: string;
  last_activity: string;
  total_corrections: number;
}

interface SubscriptionPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  price_monthly: number;
  price_yearly: number;
}

export const useAdvancedUserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles!inner(id, name, created_at),
          user_subscriptions!inner(
            status,
            subscription_plans!inner(plan_name, plan_type)
          )
        `);

      if (error) throw error;

      // Get user usage stats
      const userIds = data?.map(item => item.user_id) || [];
      const { data: usageData } = await supabase
        .from('user_usage')
        .select('user_id, created_at')
        .in('user_id', userIds);

      const usageMap = usageData?.reduce((acc, usage) => {
        if (!acc[usage.user_id]) {
          acc[usage.user_id] = { count: 0, lastActivity: usage.created_at };
        }
        acc[usage.user_id].count++;
        if (usage.created_at > acc[usage.user_id].lastActivity) {
          acc[usage.user_id].lastActivity = usage.created_at;
        }
        return acc;
      }, {} as Record<string, { count: number; lastActivity: string }>) || {};

      const formattedUsers = data?.map(item => ({
        id: item.user_id,
        name: item.profiles.name,
        created_at: item.profiles.created_at,
        role: item.role,
        plan_name: item.user_subscriptions[0]?.subscription_plans?.plan_name || 'Free',
        plan_type: item.user_subscriptions[0]?.subscription_plans?.plan_type || 'free',
        subscription_status: item.user_subscriptions[0]?.status || 'inactive',
        last_activity: usageMap[item.user_id]?.lastActivity || item.profiles.created_at,
        total_corrections: usageMap[item.user_id]?.count || 0,
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, plan_name, plan_type, price_monthly, price_yearly')
        .eq('is_active', true);

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole, assigned_by: user?.id })
        .eq('user_id', userId);

      if (error) throw error;

      await supabase.from('admin_logs').insert({
        admin_id: user?.id || '',
        action: 'role_updated',
        target_type: 'user',
        target_id: userId,
        details: { new_role: newRole },
      });

      toast.success('भूमिका सफलतापूर्वक अपडेट की गई');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('भूमिका अपडेट करने में त्रुटि');
    }
  };

  const updateUserSubscription = async (userId: string, planId: string) => {
    try {
      const { error } = await supabase.rpc('update_user_subscription', {
        user_uuid: userId,
        new_plan_id: planId,
        admin_id: user?.id || '',
      });

      if (error) throw error;

      toast.success('सब्सक्रिप्शन सफलतापूर्वक अपडेट की गई');
      fetchUsers();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('सब्सक्रिप्शन अपडेट करने में त्रुटि');
    }
  };

  const bulkUpdateRole = async (newRole: UserRole) => {
    if (selectedUsers.length === 0) return;

    try {
      const promises = selectedUsers.map(userId => updateUserRole(userId, newRole));
      await Promise.all(promises);
      
      setSelectedUsers([]);
      toast.success(`${selectedUsers.length} उपयोगकर्ताओं की भूमिका अपडेट की गई`);
    } catch (error) {
      console.error('Error in bulk update:', error);
      toast.error('बल्क अपडेट में त्रुटि');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesPlan = planFilter === 'all' || user.plan_type === planFilter;
    
    return matchesSearch && matchesRole && matchesPlan;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchPlans()]);
      setLoading(false);
    };

    loadData();

    // Set up real-time updates
    const channel = supabase
      .channel('user-management')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_roles' }, fetchUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_subscriptions' }, fetchUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    users: filteredUsers,
    plans,
    loading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    planFilter,
    setPlanFilter,
    selectedUsers,
    setSelectedUsers,
    updateUserRole,
    updateUserSubscription,
    bulkUpdateRole,
    refetch: () => Promise.all([fetchUsers(), fetchPlans()]),
  };
};
