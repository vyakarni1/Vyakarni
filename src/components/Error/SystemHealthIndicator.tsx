
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Globe
} from 'lucide-react';
import { errorLogger } from '@/services/ErrorLogger';

interface SystemHealth {
  network: 'online' | 'offline' | 'slow';
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  overall: 'healthy' | 'degraded' | 'critical';
  lastChecked: number;
  responseTime: number;
  errorRate: number;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  lastChecked: number;
  message?: string;
}

const SystemHealthIndicator: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth>({
    network: navigator.onLine ? 'online' : 'offline',
    api: 'healthy',
    database: 'healthy',
    overall: 'healthy',
    lastChecked: Date.now(),
    responseTime: 0,
    errorRate: 0,
  });

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkSystemHealth = async () => {
      const startTime = Date.now();
      const checks: HealthCheck[] = [];

      // Network connectivity check
      const networkCheck: HealthCheck = {
        name: 'नेटवर्क कनेक्टिविटी',
        status: navigator.onLine ? 'healthy' : 'down',
        lastChecked: Date.now(),
        message: navigator.onLine ? 'ऑनलाइन' : 'ऑफलाइन',
      };
      checks.push(networkCheck);

      // API health check
      try {
        const apiStartTime = Date.now();
        // Test with a simple API call - replace with your actual health endpoint
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        }).catch(() => null);
        
        const apiResponseTime = Date.now() - apiStartTime;
        
        const apiCheck: HealthCheck = {
          name: 'API सर्विस',
          status: response && response.ok ? 'healthy' : 'degraded',
          responseTime: apiResponseTime,
          lastChecked: Date.now(),
          message: response?.ok ? `स्वस्थ (${apiResponseTime}ms)` : 'प्रतिक्रिया धीमी',
        };
        checks.push(apiCheck);
      } catch (error) {
        checks.push({
          name: 'API सर्विस',
          status: 'down',
          lastChecked: Date.now(),
          message: 'सेवा अनुपलब्ध',
        });
      }

      // Database connectivity check (simulate)
      const dbCheck: HealthCheck = {
        name: 'डेटाबेस',
        status: 'healthy', // This would be based on actual database ping
        lastChecked: Date.now(),
        message: 'कनेक्टेड',
      };
      checks.push(dbCheck);

      // Calculate error rate from recent errors
      const errorStats = errorLogger.getErrorStats();
      const recentErrors = errorLogger.getRecentErrors(10);
      const errorRate = recentErrors.length / 10; // Simplified error rate calculation

      const totalResponseTime = Date.now() - startTime;
      
      // Determine overall health
      const hasDownServices = checks.some(check => check.status === 'down');
      const hasDegradedServices = checks.some(check => check.status === 'degraded');
      
      let overall: SystemHealth['overall'] = 'healthy';
      if (hasDownServices || errorRate > 0.3) {
        overall = 'critical';
      } else if (hasDegradedServices || errorRate > 0.1) {
        overall = 'degraded';
      }

      setHealth({
        network: navigator.onLine ? (totalResponseTime > 3000 ? 'slow' : 'online') : 'offline',
        api: checks.find(c => c.name === 'API सर्विस')?.status || 'down',
        database: checks.find(c => c.name === 'डेटाबेस')?.status || 'down',
        overall,
        lastChecked: Date.now(),
        responseTime: totalResponseTime,
        errorRate: Math.round(errorRate * 100),
      });

      setHealthChecks(checks);
    };

    // Initial check
    checkSystemHealth();

    // Set up periodic health checks
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds

    // Listen for network status changes
    const handleOnline = () => checkSystemHealth();
    const handleOffline = () => checkSystemHealth();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
      case 'slow':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'degraded':
      case 'slow':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'सभी सिस्टम सामान्य';
      case 'degraded':
        return 'कुछ सेवाएं धीमी';
      case 'critical':
        return 'सिस्टम समस्या';
      default:
        return 'स्थिति जांची जा रही है';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {getStatusIcon(health.overall)}
            <span className="font-medium">{getOverallStatusText(health.overall)}</span>
            <Badge variant="outline" className={getStatusColor(health.overall)}>
              {health.overall === 'healthy' ? 'स्वस्थ' : 
               health.overall === 'degraded' ? 'धीमा' : 'समस्या'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-3 w-3" />
            {Math.floor((Date.now() - health.lastChecked) / 1000)}s पहले
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {healthChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {check.name === 'नेटवर्क कनेक्टिविटी' && <Wifi className="h-4 w-4" />}
                    {check.name === 'API सर्विस' && <Globe className="h-4 w-4" />}
                    {check.name === 'डेटाबेस' && <Database className="h-4 w-4" />}
                    <span className="text-sm font-medium">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    <span className="text-xs text-gray-600">{check.message}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <span>प्रतिक्रिया समय: {health.responseTime}ms</span>
              <span>त्रुटि दर: {health.errorRate}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthIndicator;
