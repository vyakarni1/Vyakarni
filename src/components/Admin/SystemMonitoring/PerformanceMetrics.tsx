
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Database, 
  Server, 
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface MetricData {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const PerformanceMetrics = () => {
  const metrics: MetricData[] = [
    {
      name: 'CPU उपयोग',
      value: 45,
      unit: '%',
      threshold: 80,
      status: 'good',
      trend: 'stable',
      change: 0.2
    },
    {
      name: 'मेमोरी उपयोग',
      value: 68,
      unit: '%',
      threshold: 85,
      status: 'good',
      trend: 'up',
      change: 5.3
    },
    {
      name: 'डिस्क उपयोग',
      value: 89,
      unit: '%',
      threshold: 90,
      status: 'warning',
      trend: 'up',
      change: 12.1
    },
    {
      name: 'नेटवर्क I/O',
      value: 234,
      unit: 'MB/s',
      threshold: 500,
      status: 'good',
      trend: 'down',
      change: -8.7
    },
    {
      name: 'डेटाबेस कनेक्शन',
      value: 23,
      unit: 'सक्रिय',
      threshold: 100,
      status: 'good',
      trend: 'stable',
      change: 1.2
    },
    {
      name: 'प्रतिक्रिया समय',
      value: 142,
      unit: 'ms',
      threshold: 500,
      status: 'good',
      trend: 'down',
      change: -15.3
    }
  ];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return 'default';
      case 'warning':
        return 'default';
      case 'critical':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'अच्छा';
      case 'warning':
        return 'चेतावनी';
      case 'critical':
        return 'गंभीर';
      default:
        return 'अज्ञात';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return <TrendingUp className={`h-4 w-4 ${change > 0 ? 'text-red-500' : 'text-green-500'}`} />;
    } else if (trend === 'down') {
      return <TrendingDown className={`h-4 w-4 ${change < 0 ? 'text-green-500' : 'text-red-500'}`} />;
    }
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <span>प्रदर्शन मेट्रिक्स</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend, metric.change)}
                  <Badge variant={getStatusBadge(metric.status)} className="text-xs">
                    {getStatusText(metric.status)}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-end justify-between mb-2">
                <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              
              {metric.name.includes('%') || metric.name.includes('उपयोग') ? (
                <Progress 
                  value={metric.value} 
                  className="mb-2"
                  // @ts-ignore - Progress component accepts these props
                  indicatorClassName={metric.status === 'warning' ? 'bg-yellow-500' : metric.status === 'critical' ? 'bg-red-500' : 'bg-green-500'}
                />
              ) : null}
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>सीमा: {metric.threshold} {metric.unit}</span>
                <span className={metric.change >= 0 ? 'text-red-500' : 'text-green-500'}>
                  {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
