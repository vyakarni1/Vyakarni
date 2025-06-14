
import React, { Suspense, memo, useCallback, useRef, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorLogger } from '@/services/ErrorLogger';

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  componentName: string;
  enableIntersectionObserver?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const DefaultLoadingFallback: React.FC = () => (
  <Card className="w-full">
    <CardContent className="p-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
      <p className="text-gray-600">लोड हो रहा है...</p>
    </CardContent>
  </Card>
);

const DefaultErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <Card className="w-full">
    <CardContent className="p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <h3 className="text-lg font-semibold mb-2">कुछ गलत हुआ है</h3>
      <p className="text-gray-600 mb-4">घटक लोड नहीं हो सका</p>
      {process.env.NODE_ENV === 'development' && (
        <details className="text-left text-xs text-gray-500 mb-4">
          <summary>त्रुटि विवरण</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
      <Button onClick={resetErrorBoundary} variant="outline" size="sm">
        <RefreshCw className="h-4 w-4 mr-2" />
        दोबारा कोशिश करें
      </Button>
    </CardContent>
  </Card>
);

const IntersectionObserverWrapper: React.FC<{
  children: React.ReactNode;
  componentName: string;
  threshold: number;
  rootMargin: string;
  fallback: React.ReactNode;
}> = ({ children, componentName, threshold, rootMargin, fallback }) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          performanceMonitor.recordMetric({
            name: `${componentName}-lazy-load`,
            value: performance.now(),
            category: 'render',
            details: {
              componentName,
              intersectionRatio: entry.intersectionRatio,
            },
          });
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [componentName, threshold, rootMargin]);

  return (
    <div ref={ref}>
      {isIntersecting ? children : fallback}
    </div>
  );
};

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = memo(({
  children,
  fallback = <DefaultLoadingFallback />,
  errorFallback,
  componentName,
  enableIntersectionObserver = false,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const loadStartTime = useRef<number>();
  
  useEffect(() => {
    loadStartTime.current = performance.now();
    
    return () => {
      if (loadStartTime.current) {
        const loadDuration = performance.now() - loadStartTime.current;
        performanceMonitor.recordMetric({
          name: `${componentName}-mount-duration`,
          value: loadDuration,
          category: 'render',
          details: { componentName },
        });
      }
    };
  }, [componentName]);

  const handleError = useCallback((error: Error, errorInfo: any) => {
    const errorId = errorLogger.logError(error, {
      severity: 'medium',
      category: 'system',
      context: {
        componentName,
        errorInfo: errorInfo.componentStack,
        operation: 'lazy-component-load',
      },
    });

    performanceMonitor.recordMetric({
      name: `${componentName}-error`,
      value: performance.now(),
      category: 'render',
      details: {
        componentName,
        errorId,
        errorMessage: error.message,
      },
    });
  }, [componentName]);

  const CustomErrorFallback = errorFallback || DefaultErrorFallback;

  const WrappedComponent = (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onError={handleError}
      resetKeys={[componentName]}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );

  if (enableIntersectionObserver) {
    return (
      <IntersectionObserverWrapper
        componentName={componentName}
        threshold={threshold}
        rootMargin={rootMargin}
        fallback={fallback}
      >
        {WrappedComponent}
      </IntersectionObserverWrapper>
    );
  }

  return WrappedComponent;
});

LazyComponentWrapper.displayName = 'LazyComponentWrapper';

export default LazyComponentWrapper;
