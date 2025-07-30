import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Send, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useWelcomeEmail } from '@/hooks/useWelcomeEmail';
import AdminLayoutWithNavigation from '@/components/AdminLayoutWithNavigation';

interface EmailLog {
  id: string;
  user_id: string;
  email_type: string;
  recipient_email: string;
  subject: string;
  status: string;
  error_message?: string;
  sent_at: string;
  created_at: string;
}

interface EmailStats {
  total_sent: number;
  total_failed: number;
  pending_users: number;
  success_rate: number;
}

const AdminEmailManagement = () => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    total_sent: 0,
    total_failed: 0,
    pending_users: 0,
    success_rate: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { sendBulkWelcomeEmails, loading: bulkLoading } = useWelcomeEmail();

  const fetchEmailLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEmailLogs(data || []);
    } catch (error) {
      console.error('Error fetching email logs:', error);
      toast.error('ईमेल लॉग लोड करने में त्रुटि');
    }
  };

  const fetchStats = async () => {
    try {
      // Get email statistics
      const { data: emailStats, error: emailError } = await supabase
        .from('email_logs')
        .select('status');

      if (emailError) throw emailError;

      // Get users without welcome email
      const { data: usersWithoutEmail, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .is('welcome_email_sent_at', null);

      if (usersError) throw usersError;

      const totalSent = emailStats?.filter(log => log.status === 'sent').length || 0;
      const totalFailed = emailStats?.filter(log => log.status === 'failed').length || 0;
      const pendingUsers = usersWithoutEmail?.length || 0;
      const successRate = totalSent + totalFailed > 0 ? (totalSent / (totalSent + totalFailed)) * 100 : 0;

      setStats({
        total_sent: totalSent,
        total_failed: totalFailed,
        pending_users: pendingUsers,
        success_rate: Math.round(successRate)
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('आंकड़े लोड करने में त्रुटि');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmailLogs(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleBulkSendEmails = async () => {
    const success = await sendBulkWelcomeEmails();
    if (success) {
      // Refresh data after bulk send
      await Promise.all([fetchEmailLogs(), fetchStats()]);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchEmailLogs(), fetchStats()]);
    toast.success('डेटा रीफ्रेश किया गया');
  };

  const filteredLogs = emailLogs.filter(log =>
    log.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />भेजा गया</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />असफल</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />प्रतीक्षित</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayoutWithNavigation>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayoutWithNavigation>
    );
  }

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ईमेल प्रबंधन</h1>
            <p className="text-gray-600 mt-2">स्वागत ईमेल और अन्य ईमेल संदेशों का प्रबंधन करें</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>रीफ्रेश</span>
            </Button>
            <Button
              onClick={handleBulkSendEmails}
              disabled={bulkLoading || stats.pending_users === 0}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              <span>{bulkLoading ? 'भेज रहे हैं...' : `बल्क स्वागत ईमेल भेजें (${stats.pending_users})`}</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">कुल भेजे गए</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total_sent}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">असफल ईमेल</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.total_failed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">प्रतीक्षित उपयोगकर्ता</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">सफलता दर</CardTitle>
              <Mail className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.success_rate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Email Logs Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>ईमेल लॉग</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ईमेल, विषय या प्रकार से खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">प्राप्तकर्ता</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">विषय</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">प्रकार</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">स्थिति</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">भेजा गया</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">त्रुटि</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        कोई ईमेल लॉग नहीं मिला
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{log.recipient_email}</td>
                        <td className="py-3 px-4 text-sm">{log.subject}</td>
                        <td className="py-3 px-4 text-sm">
                          <Badge variant="outline">{log.email_type}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm">{getStatusBadge(log.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {log.sent_at ? new Date(log.sent_at).toLocaleString('hi-IN') : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-red-600 max-w-xs truncate">
                          {log.error_message || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminEmailManagement;