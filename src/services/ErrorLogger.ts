interface ErrorMetadata {
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: number;
  sessionId: string;
  errorId: string;
  userActions: string[];
  componentStack?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'validation' | 'system' | 'user' | 'auth' | 'payment';
  context?: Record<string, any>;
}

interface ErrorEntry {
  error: Error;
  metadata: ErrorMetadata;
  resolved: boolean;
  retryCount: number;
  lastRetryAt?: number;
}

class ErrorLoggerService {
  private errors: Map<string, ErrorEntry> = new Map();
  private userActions: string[] = [];
  private sessionId: string;
  private maxUserActions = 20;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupGlobalErrorHandlers();
    this.trackUserActions();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupGlobalErrorHandlers() {
    // Global error handler for unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(new Error(event.message), {
        severity: 'high',
        category: 'system',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        severity: 'high',
        category: 'system',
        context: {
          type: 'unhandledPromiseRejection',
          reason: event.reason,
        },
      });
    });
  }

  private trackUserActions() {
    // Track user interactions
    const trackAction = (action: string) => {
      this.userActions.push(`${new Date().toISOString()}: ${action}`);
      if (this.userActions.length > this.maxUserActions) {
        this.userActions.shift();
      }
    };

    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const action = `Click on ${target.tagName}${target.id ? `#${target.id}` : ''}${target.className ? `.${target.className.split(' ').join('.')}` : ''}`;
      trackAction(action);
    });

    // Track navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      trackAction(`Navigation to ${args[2]}`);
      return originalPushState.apply(history, args);
    };
  }

  logError(error: Error, options: Partial<ErrorMetadata> = {}): string {
    const errorId = this.generateErrorId();
    
    const metadata: ErrorMetadata = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      errorId,
      userActions: [...this.userActions],
      severity: options.severity || 'medium',
      category: options.category || 'system',
      ...options,
    };

    const errorEntry: ErrorEntry = {
      error,
      metadata,
      resolved: false,
      retryCount: 0,
    };

    this.errors.set(errorId, errorEntry);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔴 Error Logged: ${errorId}`);
      console.error('Error:', error);
      console.log('Metadata:', metadata);
      console.groupEnd();
    }

    // Send to monitoring service (implement based on your needs)
    this.sendToMonitoring(errorEntry);

    return errorId;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToMonitoring(errorEntry: ErrorEntry) {
    try {
      // In a real implementation, you would send this to your monitoring service
      // For now, we'll store it locally and potentially send to Supabase
      const errorData = {
        error_id: errorEntry.metadata.errorId,
        message: errorEntry.error.message,
        stack: errorEntry.error.stack,
        metadata: errorEntry.metadata,
        created_at: new Date(errorEntry.metadata.timestamp).toISOString(),
      };

      // Store in localStorage for now (in production, send to backend)
      const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingErrors.push(errorData);
      
      // Keep only last 100 errors
      if (existingErrors.length > 100) {
        existingErrors.splice(0, existingErrors.length - 100);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(existingErrors));
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  markErrorResolved(errorId: string) {
    const errorEntry = this.errors.get(errorId);
    if (errorEntry) {
      errorEntry.resolved = true;
      this.errors.set(errorId, errorEntry);
    }
  }

  incrementRetryCount(errorId: string) {
    const errorEntry = this.errors.get(errorId);
    if (errorEntry) {
      errorEntry.retryCount++;
      errorEntry.lastRetryAt = Date.now();
      this.errors.set(errorId, errorEntry);
    }
  }

  getErrorStats() {
    const errorArray = Array.from(this.errors.values());
    return {
      total: errorArray.length,
      resolved: errorArray.filter(e => e.resolved).length,
      unresolved: errorArray.filter(e => !e.resolved).length,
      critical: errorArray.filter(e => e.metadata.severity === 'critical').length,
      bySeverity: {
        low: errorArray.filter(e => e.metadata.severity === 'low').length,
        medium: errorArray.filter(e => e.metadata.severity === 'medium').length,
        high: errorArray.filter(e => e.metadata.severity === 'high').length,
        critical: errorArray.filter(e => e.metadata.severity === 'critical').length,
      },
      byCategory: {
        network: errorArray.filter(e => e.metadata.category === 'network').length,
        validation: errorArray.filter(e => e.metadata.category === 'validation').length,
        system: errorArray.filter(e => e.metadata.category === 'system').length,
        user: errorArray.filter(e => e.metadata.category === 'user').length,
        auth: errorArray.filter(e => e.metadata.category === 'auth').length,
        payment: errorArray.filter(e => e.metadata.category === 'payment').length,
      },
    };
  }

  getRecentErrors(limit = 10) {
    return Array.from(this.errors.values())
      .sort((a, b) => b.metadata.timestamp - a.metadata.timestamp)
      .slice(0, limit);
  }

  clearResolvedErrors() {
    for (const [errorId, errorEntry] of this.errors.entries()) {
      if (errorEntry.resolved) {
        this.errors.delete(errorId);
      }
    }
  }
}

export const errorLogger = new ErrorLoggerService();
export type { ErrorMetadata, ErrorEntry };
