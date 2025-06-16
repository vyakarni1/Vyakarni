
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { errorLogger } from '@/services/ErrorLogger';

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface SmartRetryWrapperProps {
  children: React.ReactNode;
  onRetry: () => Promise<void>;
  errorTitle?: string;
  errorMessage?: string;
  retryConfig?: Partial<RetryConfig>;
  fallbackContent?: React.ReactNode;
  showNetworkStatus?: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

const SmartRetryWrapper: React.FC<SmartRetryWrapperProps> = ({
  children,
  onRetry,
  errorTitle = 'कुछ गलत हुआ है',
  errorMessage = 'कृपया पुनः प्रयास करें',
  retryConfig = {},
  fallbackContent,
  showNetworkStatus = true,
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [errorId, setErrorId] = useState<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const calculateDelay = (attempt: number) => {
    const delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
      config.maxDelay
    );
    return delay;
  };

  const handleRetry = useCallback(async (manual = false) => {
    if (retryCount >= config.maxRetries && !manual) {
      return;
    }

    setIsRetrying(true);

    try {
      if (errorId) {
        errorLogger.incrementRetryCount(errorId);
      }

      await onRetry();
      
      // Success - clear error state
      setError(null);
      setRetryCount(0);
      setErrorId(null);
      
      if (errorId) {
        errorLogger.markErrorResolved(errorId);
      }
    } catch (retryError) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Log the retry error
      const newErrorId = errorLogger.logError(retryError as Error, {
        severity: newRetryCount >= config.maxRetries ? 'high' : 'medium',
        category: 'system',
        context: {
          retryAttempt: newRetryCount,
          maxRetries: config.maxRetries,
          isManualRetry: manual,
        },
      });
      
      setErrorId(newErrorId);
      setError(retryError as Error);

      // Auto-retry if we haven't reached max retries and it's not a manual retry
      if (newRetryCount < config.maxRetries && !manual) {
        const delay = calculateDelay(newRetryCount);
        retryTimeoutRef.current = setTimeout(() => {
          handleRetry(false);
        }, delay);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, config.maxRetries, onRetry, errorId]);

  const handleManualRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setRetryCount(0); // Reset count for manual retry
    handleRetry(true);
  };

  const canRetry = retryCount < config.maxRetries || isOnline;
  const nextRetryDelay = calculateDelay(retryCount);

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          
          <h3 className="text-lg font-semibold mb-2">{errorTitle}</h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          
          {showNetworkStatus && (
            <div className="flex items-center justify-center mb-4">
              {isOnline ? (
                <div className="flex items-center text-green-600">
                  <Wifi className="h-4 w-4 mr-2" />
                  <span className="text-sm">ऑनलाइन</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-2" />
                  <span className="text-sm">ऑफलाइन</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {canRetry && (
              <Button
                onClick={handleManualRetry}
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    पुनः प्रयास कर रहे हैं...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    पुनः प्रयास करें
                  </>
                )}
              </Button>
            )}

            {retryCount > 0 && retryCount < config.maxRetries && (
              <p className="text-sm text-gray-500">
                प्रयास {retryCount}/{config.maxRetries}
                {!isRetrying && ` • अगली कोशिश ${Math.round(nextRetryDelay / 1000)} सेकंड में`}
              </p>
            )}

            {retryCount >= config.maxRetries && !isOnline && (
              <p className="text-sm text-red-600">
                अधिकतम प्रयासों की संख्या पूर्ण हो चुकी है। कृपया इंटरनेट कनेक्शन जाँचें।
              </p>
            )}
          </div>

          {fallbackContent && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              {fallbackContent}
            </div>
          )}

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                डेवलपर जानकारी
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  // Wrap children with error boundary
  return (
    <ErrorBoundary
      onError={(error) => {
        const newErrorId = errorLogger.logError(error, {
          severity: 'high',
          category: 'system',
          context: {
            component: 'SmartRetryWrapper',
          },
        });
        setErrorId(newErrorId);
        setError(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Simple error boundary for the wrapper
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle the error display
    }

    return this.props.children;
  }
}

export default SmartRetryWrapper;
