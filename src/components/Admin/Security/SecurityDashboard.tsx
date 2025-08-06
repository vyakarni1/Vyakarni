
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Users, 
  Activity,
  Globe,
  Server,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SecurityMetric {
  title: string;
  value: string | number;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface SecurityThreat {
  id: string;
  type: 'brute_force' | 'suspicious_login' | 'data_breach' | 'malware';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  source_ip: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface SecurityDashboardProps {
  metrics: SecurityMetric[];
  threats: SecurityThreat[];
  onRefresh: () => void;
}

const SecurityDashboard = ({ metrics, threats, onRefresh }: SecurityDashboardProps) => {
  const getThreatSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'गंभीर';
      case 'high':
        return 'उच्च';
      case 'medium':
        return 'मध्यम';
      case 'low':
        return 'कम';
      default:
        return severity;
    }
  };

  const getThreatTypeText = (type: string) => {
    switch (type) {
      case 'brute_force':
        return 'ब्रूट फोर्स अटैक';
      case 'suspicious_login':
        return 'संदिग्ध लॉगिन';
      case 'data_breach':
        return 'डेटा ब्रीच';
      case 'malware':
        return 'मैलवेयर';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    {metric.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`text-sm ${metric.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${getStatusColor(metric.status).replace('text-', 'bg-').replace('-600', '-100')}`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>सुरक्षा स्थिति</span>
            </CardTitle>
            <Badge variant="default" className="bg-green-100 text-green-800">
              सुरक्षित
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>फायरवॉल सुरक्षा</span>
                <span className="text-green-600">99%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>डेटा एन्क्रिप्शन</span>
                <span className="text-green-600">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>एक्सेस कंट्रोल</span>
                <span className="text-yellow-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>ऑडिट कवरेज</span>
                <span className="text-green-600">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>सक्रिय खतरे</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              रिफ्रेश करें
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {threats.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>कोई सक्रिय खतरा नहीं मिला</p>
                </div>
              ) : (
                threats.map((threat) => (
                  <div key={threat.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {getThreatTypeText(threat.type)}
                        </h4>
                        <Badge className={getThreatSeverityColor(threat.severity)}>
                          {getThreatSeverityText(threat.severity)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{threat.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>IP: {threat.source_ip}</span>
                        <span>{new Date(threat.timestamp).toLocaleString('hi-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-600" />
            <span>त्वरित सुरक्षा कार्य</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>उपयोगकर्ता लॉक</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>सिस्टम स्कैन</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>IP ब्लॉक</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>सिस्टम रीस्टार्ट</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
