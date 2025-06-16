
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Wifi, 
  Battery, 
  HardDrive,
  X
} from 'lucide-react';
import { errorLogger } from '@/services/ErrorLogger';

interface PreventionWarning {
  id: string;
  type: 'network' | 'storage' | 'memory' | 'battery' | 'compatibility';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  suggestion: string;
  dismissible: boolean;
  autoHide?: number; // Auto hide after X seconds
}

const ErrorPreventionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warnings, setWarnings] = useState<PreventionWarning[]>([]);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkPreventionConditions = () => {
      const newWarnings: PreventionWarning[] = [];

      // Check network connectivity
      if (!navigator.onLine) {
        newWarnings.push({
          id: 'network-offline',
          type: 'network',
          severity: 'high',
          title: 'कोई इंटरनेट कनेक्शन नहीं',
          message: 'आप वर्तमान में ऑफलाइन हैं।',
          suggestion: 'कृपया अपना इंटरनेट कनेक्शन जाँचे और पुनः कोशिश करें।',
          dismissible: false,
        });
      }

      // Check storage space
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          const usagePercentage = estimate.usage && estimate.quota 
            ? (estimate.usage / estimate.quota) * 100 
            : 0;
          
          if (usagePercentage > 90) {
            const warning: PreventionWarning = {
              id: 'storage-full',
              type: 'storage',
              severity: 'medium',
              title: 'स्टोरेज स्थान कम',
              message: `आपका डिवाइस स्टोरेज ${Math.round(usagePercentage)}% भरा है।`,
              suggestion: 'कुछ फाइलें या ऐप्स डिलीट करके स्थान बनायें।',
              dismissible: true,
              autoHide: 10000,
            };
            
            setWarnings(prev => {
              const exists = prev.some(w => w.id === warning.id);
              return exists ? prev : [...prev, warning];
            });
          }
        });
      }

      // Check memory usage (if available)
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize && memInfo.totalJSHeapSize) {
          const memoryUsage = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100;
          
          if (memoryUsage > 80) {
            newWarnings.push({
              id: 'memory-high',
              type: 'memory',
              severity: 'medium',
              title: 'मेमोरी उपयोग अधिक',
              message: `मेमोरी का ${Math.round(memoryUsage)}% उपयोग हो रहा है।`,
              suggestion: 'अन्य टैब्स बंद करें या पेज रीफ्रेश करें।',
              dismissible: true,
              autoHide: 8000,
            });
          }
        }
      }

      // Check battery status (if available)
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging) {
            const warning: PreventionWarning = {
              id: 'battery-low',
              type: 'battery',
              severity: 'low',
              title: 'बैटरी कम',
              message: `बैटरी ${Math.round(battery.level * 100)}% बची है।`,
              suggestion: 'डिवाइस को चार्ज करें या पावर सेविंग मोड चालू करें।',
              dismissible: true,
              autoHide: 15000,
            };
            
            setWarnings(prev => {
              const exists = prev.some(w => w.id === warning.id);
              return exists ? prev : [...prev, warning];
            });
          }
        }).catch(() => {
          // Battery API not supported, ignore
        });
      }

      // Check browser compatibility issues
      const isOldBrowser = (() => {
        const userAgent = navigator.userAgent;
        // Check for old Internet Explorer
        if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1) {
          return true;
        }
        
        // Check for very old versions of other browsers
        const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
        if (chromeMatch && parseInt(chromeMatch[1]) < 70) {
          return true;
        }
        
        return false;
      })();

      if (isOldBrowser) {
        newWarnings.push({
          id: 'browser-compatibility',
          type: 'compatibility',
          severity: 'medium',
          title: 'ब्राउज़र अपडेट की आवश्यकता',
          message: 'आपका ब्राउज़र पुराना है।',
          suggestion: 'उत्तम अनुभव के लिये ब्राउज़र को अपडेट करें।',
          dismissible: true,
        });
      }

      // Check error patterns
      const recentErrors = errorLogger.getRecentErrors(5);
      const errorPatterns = recentErrors.reduce((acc, error) => {
        const key = error.error.message;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(errorPatterns).forEach(([errorMessage, count]) => {
        if (count >= 3) {
          newWarnings.push({
            id: `error-pattern-${errorMessage.slice(0, 20)}`,
            type: 'compatibility',
            severity: 'high',
            title: 'दोहरायी जाने वाली त्रुटि',
            message: `एक ही त्रुटि ${count} बार हुई है।`,
            suggestion: 'पेज रीफ्रेश करें या सपोर्ट से संपर्क करें।',
            dismissible: true,
          });
        }
      });

      // Update warnings state
      setWarnings(prev => {
        const existingIds = new Set(prev.map(w => w.id));
        const filtered = newWarnings.filter(w => !existingIds.has(w.id));
        return [...prev, ...filtered];
      });
    };

    // Initial check
    checkPreventionConditions();

    // Set up periodic checks
    const interval = setInterval(checkPreventionConditions, 5000);

    // Listen for network changes
    const handleOnline = () => {
      setWarnings(prev => prev.filter(w => w.id !== 'network-offline'));
    };
    
    const handleOffline = () => checkPreventionConditions();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Auto-hide warnings with autoHide property
    warnings.forEach(warning => {
      if (warning.autoHide && !dismissedWarnings.has(warning.id)) {
        const timer = setTimeout(() => {
          dismissWarning(warning.id);
        }, warning.autoHide);

        return () => clearTimeout(timer);
      }
    });
  }, [warnings, dismissedWarnings]);

  const dismissWarning = (id: string) => {
    setDismissedWarnings(prev => new Set([...prev, id]));
    setWarnings(prev => prev.filter(w => w.id !== id));
  };

  const getWarningIcon = (type: PreventionWarning['type']) => {
    switch (type) {
      case 'network':
        return <Wifi className="h-5 w-5" />;
      case 'storage':
        return <HardDrive className="h-5 w-5" />;
      case 'memory':
        return <AlertTriangle className="h-5 w-5" />;
      case 'battery':
        return <Battery className="h-5 w-5" />;
      case 'compatibility':
        return <Shield className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: PreventionWarning['severity']) => {
    switch (severity) {
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const activeWarnings = warnings.filter(w => !dismissedWarnings.has(w.id));

  return (
    <>
      {/* Prevention warnings */}
      {activeWarnings.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {activeWarnings.map(warning => (
            <Card key={warning.id} className={`border-l-4 ${getSeverityColor(warning.severity)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getWarningIcon(warning.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{warning.title}</h4>
                      <p className="text-xs mb-2">{warning.message}</p>
                      <p className="text-xs opacity-80">{warning.suggestion}</p>
                    </div>
                  </div>
                  
                  {warning.dismissible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissWarning(warning.id)}
                      className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Render children */}
      {children}
    </>
  );
};

export default ErrorPreventionGuard;
