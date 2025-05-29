
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, CreditCard, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';

interface AdminStats {
  totalUsers: number;
  totalSubmissions: number;
  unreadSubmissions: number;
  activeSubscriptions: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalSubmissions: 0,
    unreadSubmissions: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users count
        const { count: usersCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });

        // Get contact submissions stats
        const { count: totalSubmissions } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true });

        const { count: unreadSubmissions } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread');

        // Get active subscriptions count
        const { count: activeSubscriptions } = await supabase
          .from('user_subscriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        setStats({
          totalUsers: usersCount || 0,
          totalSubmissions: totalSubmissions || 0,
          unreadSubmissions: unreadSubmissions || 0,
          activeSubscriptions: activeSubscriptions || 0,
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
            <h1 className="text-3xl font-bold text-gray-900">व्यवस्थापक डैशबोर्ड</h1>
            <p className="text-gray-600 mt-2">सिस्टम अवलोकन और प्रबंधन</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">कुल उपयोगकर्ता</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  पंजीकृत उपयोगकर्ता
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">संपर्क संदेश</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.unreadSubmissions} अपठित
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">सक्रिय सब्सक्रिप्शन</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">
                  भुगतान सदस्यता
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">सिस्टम स्थिति</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">सक्रिय</div>
                <p className="text-xs text-muted-foreground">
                  सभी सेवाएं चालू
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>हाल की गतिविधि</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">हाल की गतिविधियों की सूची यहाँ दिखाई जाएगी।</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>त्वरित कार्य</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a 
                  href="/admin/contacts" 
                  className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="font-medium">संपर्क संदेश देखें</div>
                  <div className="text-sm text-gray-600">नए संदेशों की समीक्षा करें</div>
                </a>
                <a 
                  href="/admin/users" 
                  className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="font-medium">उपयोगकर्ता प्रबंधन</div>
                  <div className="text-sm text-gray-600">उपयोगकर्ता भूमिकाएं संपादित करें</div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
