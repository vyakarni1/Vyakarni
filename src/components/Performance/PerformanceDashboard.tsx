
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  Zap, 
  Database, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { apiCache, uiCache, userDataCache } from '@/services/cacheManager';
import type { PerformanceMetric, PerformanceReport } from '@/utils/performanceMonitor';

const PerformanceDashboard: React.FC = () => {
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<PerformanceMetric['category']>('render');

  useEffect(() => {
    const updatePerformanceData = () => {
      const report = performanceMonitor.getPerformanceReport();
      setPerformanceReport(report);
    };

    updatePerformanceData();
    const interval = setInterval(updatePerformanceData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    const report = performanceMonitor.getPerformanceReport();
    setPerformanceReport(report);
    setIsRefreshing(false);
  };

  const exportPerformanceData = () => {
    if (!performanceReport) return;

    const dataStr = JSON.stringify(performanceReport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const getCacheStats = () => {
    return {
      api: apiCache.getCacheStats(),
      ui: uiCache.getCacheStats(),
      userData: userDataCache.getCacheStats(),
    };
  };

  const getPerformanceScore = () => {
    if (!performanceReport) return 0;

    const renderMetrics = performanceReport.metrics.filter(m => m.category === 'render');
    const avgRenderTime = renderMetrics.reduce((sum, m) => sum + m.value, 0) / renderMetrics.length || 0;
    
    const networkMetrics = performanceReport.metrics.filter(m => m.category === 'network');
    const avgNetworkTime = networkMetrics.reduce((sum, m) => sum + m.value, 0) / networkMetrics.length || 0;

    // Simple scoring algorithm (0-100)
    const renderScore = Math.max(0, 100 - (avgRenderTime / 10));
    const networkScore = Math.max(0, 100 - (avgNetworkTime / 100));
    const errorScore = Math.max(0, 100 - (performanceReport.errors * 10));

    return Math.round((renderScore + networkScore + errorScore) / 3);
  };

  const getMetricsByCategory = (category: PerformanceMetric['category']) => {
    return performanceReport?.metrics.filter(m => m.category === category) || [];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getPerformanceStatus = (score: number) => {
    if (score >= 90) return { status: 'excellent', color: 'bg-green-500', icon: CheckCircle };
    if (score >= 70) return { status: 'good', color: 'bg-blue-500', icon: TrendingUp };
    if (score >= 50) return { status: 'fair', color: 'bg-yellow-500', icon: Clock };
    return { status: 'poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  if (!performanceReport) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>प्रदर्शन डेटा लोड हो रहा है...</p>
        </CardContent>
      </Card>
    );
  }

  const performanceScore = getPerformanceScore();
  const performanceStatus = getPerformanceStatus(performanceScore);
  const cacheStats = getCacheStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">प्रदर्शन डैशबोर्ड</h2>
          <p className="text-gray-600">एप्लिकेशन प्रदर्शन मॉनिटरिंग और विश्लेषण</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            रीफ्रेश करें
          </Button>
          <Button variant="outline" onClick={exportPerformanceData}>
            <Download className="h-4 w-4 mr-2" />
            एक्सपोर्ट करें
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">प्रदर्शन स्कोर</p>
                <p className="text-2xl font-bold">{performanceScore}</p>
              </div>
              <div className={`p-2 rounded-full ${performanceStatus.color}`}>
                <performanceStatus.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <Progress value={performanceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">कुल मेट्रिक्स</p>
                <p className="text-2xl font-bold">{performanceReport.metrics.length}</p>
              </div>
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">सत्र अवधि</p>
                <p className="text-2xl font-bold">{formatDuration(performanceReport.totalDuration)}</p>
              </div>
              <Clock className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">त्रुटियां</p>
                <p className="text-2xl font-bold">{performanceReport.errors}</p>
              </div>
              <AlertTriangle className={`h-6 w-6 ${performanceReport.errors > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">मेट्रिक्स</TabsTrigger>
          <TabsTrigger value="cache">कैश स्टेट्स</TabsTrigger>
          <TabsTrigger value="insights">अंतर्दृष्टि</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                प्रदर्शन मेट्रिक्स
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {(['render', 'network', 'memory', 'user-interaction'] as const).map((category) => (
                    <Button
                      key={category}
                      variant={selectedMetricCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetricCategory(category)}
                    >
                      {category === 'render' && 'रेंडर'}
                      {category === 'network' && 'नेटवर्क'}
                      {category === 'memory' && 'मेमोरी'}
                      {category === 'user-interaction' && 'उपयोगकर्ता'}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  {getMetricsByCategory(selectedMetricCategory).slice(-10).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(metric.timestamp).toLocaleTimeString('hi-IN')}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatDuration(metric.value)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(cacheStats).map(([cacheType, stats]) => (
              <Card key={cacheType}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {cacheType === 'api' && 'API कैश'}
                    {cacheType === 'ui' && 'UI कैश'}
                    {cacheType === 'userData' && 'उपयोगकर्ता डेटा कैश'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>आकार:</span>
                    <span>{stats.size}/{stats.maxSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>हिट रेट:</span>
                    <span>{stats.hitRate.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>औसत आयु:</span>
                    <span>{formatDuration(stats.averageAge)}</span>
                  </div>
                  <Progress value={(stats.size / stats.maxSize) * 100} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>प्रदर्शन अंतर्दृष्टि</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {performanceScore >= 90 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800">उत्कृष्ट प्रदर्शन! आपका एप्लिकेशन बहुत तेज़ी से चल रहा है।</p>
                  </div>
                )}
                
                {performanceScore < 70 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-800">प्रदर्शन में सुधार की गुंजाइश है। धीमे घटकों की जांच करें।</p>
                  </div>
                )}

                {cacheStats.api.hitRate < 0.5 && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <p className="text-blue-800">कैश दर कम है। API कॉल्स को अनुकूलित करने पर विचार करें।</p>
                  </div>
                )}

                {performanceReport.errors > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800">{performanceReport.errors} त्रुटियां पाई गईं। इन्हें जल्दी ठीक करें।</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
