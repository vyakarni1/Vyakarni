import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is still loading, keep role loading as well
    if (authLoading) {
      console.log('useUserRole: Auth still loading, keeping role loading true');
      setLoading(true);
      return;
    }

    // If no user after auth is done loading, set defaults
    if (!user) {
      console.log('useUserRole: No user found after auth loaded, setting defaults');
      setRole(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // User exists and auth is done, now fetch role
    const fetchUserRole = async () => {
      console.log('useUserRole: Fetching role for user:', user.id);
      setLoading(true); // Set loading true when starting fetch
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('assigned_at', { ascending: false })
          .limit(1)
          .maybeSingle(); // Use maybeSingle instead of single to handle 0 rows gracefully

        if (error) {
          console.error('useUserRole: Error fetching user role:', error);
          // Set default role on error
          setRole('user');
          setIsAdmin(false);
          return;
        }

        const userRole = data?.role || 'user';
        console.log('useUserRole: Found role:', userRole);
        setRole(userRole);
        setIsAdmin(userRole === 'admin');
      } catch (error) {
        console.error('useUserRole: Exception in fetchUserRole:', error);
        // Set default role on exception
        setRole('user');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, authLoading]); // Include authLoading in dependencies

  return { role, isAdmin, loading };
};
