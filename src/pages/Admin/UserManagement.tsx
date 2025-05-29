
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get users with their roles and profiles
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          assigned_at
        `);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      // Get profiles for user names
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, created_at');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine the data (note: we can't directly query auth.users, so we use what we have)
      const usersWithRoles = userRoles?.map(userRole => {
        const profile = profiles?.find(p => p.id === userRole.user_id);
        return {
          id: userRole.user_id,
          email: `user-${userRole.user_id.slice(0, 8)}`, // Placeholder since we can't access auth.users
          name: profile?.name || 'अज्ञात उपयोगकर्ता',
          role: userRole.role,
          created_at: profile?.created_at || userRole.assigned_at,
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      // Remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
          assigned_by: user?.id,
        });

      if (error) {
        console.error('Error updating user role:', error);
        toast.error('भूमिका अपडेट करने में त्रुटि');
        return;
      }

      // Log admin action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: user?.id || '',
          action: 'role_updated',
          target_type: 'user',
          target_id: userId,
          details: { old_role: users.find(u => u.id === userId)?.role, new_role: newRole },
        });

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );

      toast.success('भूमिका सफलतापूर्वक अपडेट की गई');
    } catch (error) {
      console.error('Error in updateUserRole:', error);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'moderator':
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'व्यवस्थापक';
      case 'moderator':
        return 'मॉडरेटर';
      default:
        return 'उपयोगकर्ता';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">उपयोगकर्ता प्रबंधन</h1>
            <p className="text-gray-600 mt-2">उपयोगकर्ता भूमिकाओं का प्रबंधन करें</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>सभी उपयोगकर्ता ({users.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>नाम</TableHead>
                    <TableHead>उपयोगकर्ता ID</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>शामिल होने की तारीख</TableHead>
                    <TableHead>कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.name}</TableCell>
                      <TableCell className="font-mono text-sm">{userData.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <Badge className={`flex items-center space-x-1 w-fit ${getRoleColor(userData.role)}`}>
                          {getRoleIcon(userData.role)}
                          <span>{getRoleText(userData.role)}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(userData.created_at).toLocaleDateString('hi-IN')}
                      </TableCell>
                      <TableCell>
                        {userData.id !== user?.id && (
                          <Select
                            value={userData.role}
                            onValueChange={(value: UserRole) => updateUserRole(userData.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">उपयोगकर्ता</SelectItem>
                              <SelectItem value="moderator">मॉडरेटर</SelectItem>
                              <SelectItem value="admin">व्यवस्थापक</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {userData.id === user?.id && (
                          <span className="text-sm text-gray-500">स्वयं</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  कोई उपयोगकर्ता नहीं मिला
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;
