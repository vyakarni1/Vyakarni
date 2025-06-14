
import { useEffect, useCallback, useRef } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';

export const usePerformanceTracking = (componentName: string) => {
  const renderStartTime = useRef<number>();

  useEffect(() => {
    renderStartTime.current = performance.now();
    performanceMonitor.markRenderStart(componentName);

    return () => {
      if (renderStartTime.current) {
        const renderDuration = performance.now() - renderStartTime.current;
        performanceMonitor.recordMetric({
          name: `${componentName}-total-render`,
          value: renderDuration,
          category: 'render',
          details: { componentName },
        });
      }
      performanceMonitor.markRenderEnd(componentName);
    };
  }, [componentName]);

  const trackInteraction = useCallback((action: string, details?: Record<string, any>) => {
    performanceMonitor.trackUserInteraction(`${componentName}-${action}`, {
      component: componentName,
      ...details,
    });
  }, [componentName]);

  const measureOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T> | T
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      performanceMonitor.recordMetric({
        name: `${componentName}-${operationName}`,
        value: duration,
        category: 'user-interaction',
        details: { 
          component: componentName,
          operation: operationName,
          success: true,
        },
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      performanceMonitor.recordMetric({
        name: `${componentName}-${operationName}-error`,
        value: duration,
        category: 'user-interaction',
        details: { 
          component: componentName,
          operation: operationName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      
      throw error;
    }
  }, [componentName]);

  return {
    trackInteraction,
    measureOperation,
  };
};
