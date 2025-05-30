
import React, { useState } from 'react';
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import PerformanceMetrics from '@/components/Admin/SystemMonitoring/PerformanceMetrics';
import SystemAlerts from '@/components/Admin/SystemMonitoring/SystemAlerts';
import AuditTrail from '@/components/Admin/Security/AuditTrail';
import SecurityDashboard from '@/components/Admin/Security/SecurityDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Shield, 
  AlertTriangle, 
  Server,
  Eye,
  Lock,
  Globe
} from 'lucide-react';

const SystemMonitoring = () => {
  const [activeTab, setActiveTab] = useState('performance');

  // Mock data for demonstration
  const mockAlerts = [
    {
      id: '1',
      type: 'error' as const,
      title: 'डेटाबेस कनेक्शन त्रुटि',
      message: 'प्राथमिक डेटाबेस से कनेक्शन में समस्या हो रही है।',
      timestamp: new Date().toISOString(),
      acknowledged: false
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'उच्च CPU उपयोग',
      message: 'CPU उपयोग 85% से अधिक हो गया है।',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      acknowledged: false
    }
  ];

  const mockAuditLogs = [
    {
      id: '1',
      admin_id: 'admin1',
      admin_name: 'अमित शर्मा',
      action_type: 'update',
      resource_type: 'user',
      resource_id: 'user123',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      created_at: new Date().toISOString()
    }
  ];

  const mockSecurityMetrics = [
    {
      title: 'सक्रिय सत्र',
      value: 1247,
      change: 5.2,
      status: 'good' as const,
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'असफल लॉगिन',
      value: 23,
      change: -12.5,
      status: 'warning' as const,
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: 'ब्लॉक किए गए IP',
      value: 156,
      change: 8.3,
      status: 'good' as const,
      icon: <Globe className="h-5 w-5" />
    },
    {
      title: 'सुरक्षा स्कोर',
      value: '98%',
      change: 2.1,
      status: 'good' as const,
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const mockSecurityThreats = [
    {
      id: '1',
      type: 'brute_force' as const,
      severity: 'high' as const,
      description: 'कई असफल लॉगिन प्रयास IP 192.168.1.50 से',
      timestamp: new Date().toISOString(),
      source_ip: '192.168.1.50',
      status: 'active' as const
    }
  ];

  const handleAcknowledgeAlert = (alertId: string) => {
    console.log('Alert acknowledged:', alertId);
  };

  const handleDismissAlert = (alertId: string) => {
    console.log('Alert dismissed:', alertId);
  };

  const handleExportAudit = (format: 'csv' | 'json') => {
    console.log('Exporting audit logs as:', format);
  };

  const handleSecurityRefresh = () => {
    console.log('Refreshing security dashboard');
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              सिस्टम मॉनिटरिंग
            </h1>
            <p className="text-gray-600 mt-1">
              प्रदर्शन, सुरक्षा और ऑडिट निगरानी
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">लाइव मॉनिटरिंग</span>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">सिस्टम स्थिति</p>
                  <p className="text-2xl font-bold">स्वस्थ</p>
                </div>
                <Server className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">प्रदर्शन</p>
                  <p className="text-2xl font-bold">उत्कृष्ट</p>
                </div>
                <Activity className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">सुरक्षा</p>
                  <p className="text-2xl font-bold">सुरक्षित</p>
                </div>
                <Shield className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">अलर्ट</p>
                  <p className="text-2xl font-bold">{mockAlerts.length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>प्रदर्शन</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>सुरक्षा</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>ऑडिट</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>अलर्ट</span>
              {mockAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {mockAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecurityDashboard
              metrics={mockSecurityMetrics}
              threats={mockSecurityThreats}
              onRefresh={handleSecurityRefresh}
            />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <AuditTrail
              logs={mockAuditLogs}
              isLoading={false}
              onExport={handleExportAudit}
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <SystemAlerts
              alerts={mockAlerts}
              onAcknowledge={handleAcknowledgeAlert}
              onDismiss={handleDismissAlert}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAdminLayout>
  );
};

export default SystemMonitoring;
