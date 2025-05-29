
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  CreditCard,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useState } from 'react';

const Subscriptions = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  // Mock data - replace with real data from your hook
  const subscriptionStats = {
    total: 1248,
    active: 892,
    cancelled: 156,
    expired: 200,
    revenue: 245800
  };

  const subscriptions = [
    {
      id: '1',
      user_name: 'राम शर्मा',
      email: 'ram@example.com',
      plan: 'Premium',
      status: 'active',
      amount: 999,
      created_at: '2024-01-15',
      expires_at: '2024-02-15'
    },
    {
      id: '2',
      user_name: 'प्रिया पटेल',
      email: 'priya@example.com',
      plan: 'Basic',
      status: 'active',
      amount: 499,
      created_at: '2024-01-10',
      expires_at: '2024-02-10'
    },
    {
      id: '3',
      user_name: 'अमित कुमार',
      email: 'amit@example.com',
      plan: 'Premium',
      status: 'cancelled',
      amount: 999,
      created_at: '2024-01-05',
      expires_at: '2024-01-20'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'सक्रिय', variant: 'default' as const },
      cancelled: { label: 'रद्द', variant: 'destructive' as const },
      expired: { label: 'समाप्त', variant: 'secondary' as const },
      pending: { label: 'लंबित', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              सब्सक्रिप्शन प्रबंधन
            </h1>
            <p className="text-gray-600 mt-1">
              उपयोगकर्ता सब्सक्रिप्शन और योजनाओं का प्रबंधन
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>एक्सपोर्ट</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>नई योजना</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">कुल सब्सक्रिप्शन</p>
                  <p className="text-2xl font-bold text-gray-900">{subscriptionStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">सक्रिय</p>
                  <p className="text-2xl font-bold text-green-600">{subscriptionStats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">रद्द</p>
                  <p className="text-2xl font-bold text-red-600">{subscriptionStats.cancelled}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">समाप्त</p>
                  <p className="text-2xl font-bold text-orange-600">{subscriptionStats.expired}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">कुल आय</p>
                  <p className="text-2xl font-bold text-purple-600">₹{subscriptionStats.revenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>सब्सक्रिप्शन सूची</span>
              <div className="flex items-center space-x-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी स्थिति</SelectItem>
                    <SelectItem value="active">सक्रिय</SelectItem>
                    <SelectItem value="cancelled">रद्द</SelectItem>
                    <SelectItem value="expired">समाप्त</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPlan} onValueChange={setFilterPlan}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">सभी योजनाएं</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">उपयोगकर्ता</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">योजना</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">स्थिति</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">राशि</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">शुरुआत</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">समाप्ति</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">कार्य</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{subscription.user_name}</div>
                          <div className="text-sm text-gray-500">{subscription.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{subscription.plan}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(subscription.status)}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ₹{subscription.amount}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(subscription.created_at).toLocaleDateString('hi-IN')}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(subscription.expires_at).toLocaleDateString('hi-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            देखें
                          </Button>
                          <Button variant="outline" size="sm">
                            संपादित करें
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {subscriptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                कोई सब्सक्रिप्शन नहीं मिली
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default Subscriptions;
