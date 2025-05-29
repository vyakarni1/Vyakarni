
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CreditCard,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import useSubscriptionManagement from '@/hooks/useSubscriptionManagement';

const Subscriptions = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    stats,
    statsLoading,
    subscriptions,
    subscriptionsLoading,
    getFilteredSubscriptions,
    updateSubscription,
    isUpdating,
    exportSubscriptions,
  } = useSubscriptionManagement();

  const filteredSubscriptions = getFilteredSubscriptions({
    status: filterStatus,
    plan: filterPlan,
    search: searchQuery,
  });

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

  const handleStatusUpdate = (subscriptionId: string, newStatus: string) => {
    updateSubscription({ id: subscriptionId, status: newStatus });
  };

  const handleExport = () => {
    exportSubscriptions(filteredSubscriptions);
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
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={handleExport}
              disabled={!filteredSubscriptions.length}
            >
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
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                  )}
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
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
                  )}
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
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-red-600">{stats?.cancelled || 0}</p>
                  )}
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
                  {statsLoading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-orange-600">{stats?.expired || 0}</p>
                  )}
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
                  {statsLoading ? (
                    <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-purple-600">₹{stats?.revenue?.toLocaleString() || 0}</p>
                  )}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="खोजें..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>

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
            {subscriptionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">लोड हो रहा है...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>उपयोगकर्ता</TableHead>
                    <TableHead>योजना</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>राशि</TableHead>
                    <TableHead>शुरुआत</TableHead>
                    <TableHead>समाप्ति</TableHead>
                    <TableHead>कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{subscription.user_name}</div>
                          <div className="text-sm text-gray-500">{subscription.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscription.plan_name}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(subscription.status)}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{subscription.amount}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(subscription.created_at).toLocaleDateString('hi-IN')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {subscription.expires_at 
                          ? new Date(subscription.expires_at).toLocaleDateString('hi-IN')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleStatusUpdate(subscription.id, 
                              subscription.status === 'active' ? 'cancelled' : 'active'
                            )}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!subscriptionsLoading && filteredSubscriptions.length === 0 && (
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
