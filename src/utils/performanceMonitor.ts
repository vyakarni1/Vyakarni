interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'render' | 'network' | 'memory' | 'user-interaction';
  details?: Record<string, any>;
}

interface PerformanceReport {
  sessionId: string;
  userAgent: string;
  metrics: PerformanceMetric[];
  errors: number;
  totalDuration: number;
  createdAt: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private sessionId: string;
  private startTime: number;
  private observer?: PerformanceObserver;

  constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = performance.now();
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            name: entry.name,
            value: entry.duration || entry.startTime,
            timestamp: Date.now(),
            category: this.categorizeEntry(entry),
            details: {
              entryType: entry.entryType,
              startTime: entry.startTime,
              duration: entry.duration,
            },
          });
        }
      });

      try {
        this.observer.observe({ 
          entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
        });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }
  }

  private categorizeEntry(entry: PerformanceEntry): PerformanceMetric['category'] {
    switch (entry.entryType) {
      case 'navigation':
      case 'resource':
        return 'network';
      case 'paint':
      case 'measure':
        return 'render';
      default:
        return 'user-interaction';
    }
  }

  private setupMemoryMonitoring() {
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.recordMetric({
          name: 'memory-usage',
          value: memory.usedJSHeapSize,
          timestamp: Date.now(),
          category: 'memory',
          details: {
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit,
            usedJSHeapSize: memory.usedJSHeapSize,
          },
        });
      }
    }, 30000); // Check memory every 30 seconds
  }

  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'> & { timestamp?: number }) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    };
    
    this.metrics.push(fullMetric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Log performance issues in development
    if (process.env.NODE_ENV === 'development' && fullMetric.value > 1000) {
      console.warn(`Performance warning: ${fullMetric.name} took ${fullMetric.value}ms`);
    }
  }

  markRenderStart(componentName: string) {
    performance.mark(`${componentName}-render-start`);
  }

  markRenderEnd(componentName: string) {
    performance.mark(`${componentName}-render-end`);
    performance.measure(
      `${componentName}-render`,
      `${componentName}-render-start`,
      `${componentName}-render-end`
    );
  }

  trackUserInteraction(action: string, details?: Record<string, any>) {
    this.recordMetric({
      name: `user-${action}`,
      value: performance.now() - this.startTime,
      category: 'user-interaction',
      details,
    });
  }

  getPerformanceReport(): PerformanceReport {
    return {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      metrics: [...this.metrics],
      errors: this.metrics.filter(m => m.name.includes('error')).length,
      totalDuration: performance.now() - this.startTime,
      createdAt: Date.now(),
    };
  }

  getMetricsByCategory(category: PerformanceMetric['category']) {
    return this.metrics.filter(m => m.category === category);
  }

  getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    return relevantMetrics.reduce((sum, m) => sum + m.value, 0) / relevantMetrics.length;
  }

  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
export type { PerformanceMetric, PerformanceReport };
