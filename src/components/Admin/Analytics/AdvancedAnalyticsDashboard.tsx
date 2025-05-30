
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  FileText,
  Settings,
  Download,
  RefreshCw,
  Calendar,
  Target
} from 'lucide-react';
import { useEnhancedAdminAnalytics } from '@/hooks/useEnhancedAdminAnalytics';
import {
  EnhancedUserGrowthChart,
  EnhancedRevenueChart,
  UserActivityChart,
  AnalyticsControlPanel
} from './EnhancedAnalyticsCharts';
import ReportGenerator from './ReportGenerator';

const AdvancedAnalyticsDashboard = () => {
  const { analytics, isLoading, exportAnalytics, refetch } = useEnhancedAdminAnalytics();
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      title: 'कुल उपयोगकर्ता',
      value: analytics?.total_users?.toLocaleString() || '0',
      change: '+12.5%',
      positive: true,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'मासिक राजस्व',
      value: `₹${analytics?.revenue_this_month?.toLocaleString() || '0'}`,
      change: '+8.2%',
      positive: true,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'सक्रिय सब्सक्रिप्शन',
      value: analytics?.active_subscriptions?.toLocaleString() || '0',
      change: '+15.3%',
      positive: true,
      icon: Target,
      color: 'purple'
    },
    {
      title: 'आज के सुधार',
      value: analytics?.corrections_today?.toLocaleString() || '0',
      change: '-2.1%',
      positive: false,
      icon: Activity,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            उन्नत एनालिटिक्स डैशबोर्ड
          </h2>
          <p className="text-gray-600 mt-1">
            व्यापक डेटा विश्लेषण और स्वचालित रिपोर्टिंग
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">पिछले 7 दिन</SelectItem>
              <SelectItem value="30">पिछले 30 दिन</SelectItem>
              <SelectItem value="90">पिछले 90 दिन</SelectItem>
              <SelectItem value="365">पिछला साल</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refetch} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            रिफ्रेश
          </Button>
          <Button onClick={() => exportAnalytics('pdf')} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            एक्सपोर्ट
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <Badge 
                    variant={stat.positive ? "default" : "destructive"} 
                    className="mt-2 text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            अवलोकन
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            विस्तृत विश्लेषण
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            ट्रेंड्स
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            रिपोर्ट्स
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedUserGrowthChart />
            </div>
            <UserActivityChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedRevenueChart />
            </div>
            <AnalyticsControlPanel />
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>उपयोगकर्ता विभाजन</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>नए उपयोगकर्ता</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-blue-200 rounded-full">
                        <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>वापसी करने वाले</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-green-200 rounded-full">
                        <div className="w-1/4 h-full bg-green-600 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>रूपांतरण फ़नल</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-lg font-semibold">{analytics?.total_users || 0}</div>
                    <div className="text-sm text-gray-600">कुल विज़िटर्स</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-semibold">{Math.floor((analytics?.total_users || 0) * 0.3)}</div>
                    <div className="text-sm text-gray-600">साइन अप्स</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-lg font-semibold">{analytics?.active_subscriptions || 0}</div>
                    <div className="text-sm text-gray-600">पेड सब्सक्रिप्शन</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>मासिक ट्रेंड्स</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>उपयोगकर्ता वृद्धि</span>
                    <Badge variant="default">+23%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>राजस्व वृद्धि</span>
                    <Badge variant="default">+18%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>सुधार उपयोग</span>
                    <Badge variant="default">+31%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>ग्राहक संतुष्टि</span>
                    <Badge variant="default">+5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>भविष्यवाणी</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">अगले महीने का अनुमान</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>नए उपयोगकर्ता</span>
                        <span className="font-semibold">~{Math.floor((analytics?.users_this_month || 0) * 1.15)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>अनुमानित राजस्व</span>
                        <span className="font-semibold">₹{Math.floor((analytics?.revenue_this_month || 0) * 1.12).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
