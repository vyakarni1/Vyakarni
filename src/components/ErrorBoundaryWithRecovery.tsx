
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home, Bug, FileText } from "lucide-react";
import { errorLogger } from '@/services/ErrorLogger';
import ErrorReportModal from './Error/ErrorReportModal';
import BackButton from './Navigation/BackButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  enableRecovery?: boolean;
  enableReporting?: boolean;
  level?: 'page' | 'component' | 'feature';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  retryCount: number;
  showReportModal: boolean;
}

class ErrorBoundaryWithRecovery extends Component<Props, State> {
  private retryTimeouts: Set<NodeJS.Timeout> = new Set();

  public state: State = {
    hasError: false,
    retryCount: 0,
    showReportModal: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundaryWithRecovery caught an error:', error, errorInfo);

    // Log error with enhanced metadata
    const errorId = errorLogger.logError(error, {
      severity: this.props.level === 'page' ? 'critical' : 'high',
      category: 'system',
      context: {
        componentStack: errorInfo.componentStack,
        errorBoundaryLevel: this.props.level || 'component',
        retryCount: this.state.retryCount,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-retry for certain types of errors after a delay
    if (this.shouldAutoRetry(error) && this.state.retryCount < 2) {
      const timeout = setTimeout(() => {
        this.handleRetry();
      }, 3000 + this.state.retryCount * 2000); // Increasing delay

      this.retryTimeouts.add(timeout);
    }
  }

  public componentWillUnmount() {
    // Clear all retry timeouts
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  private shouldAutoRetry(error: Error): boolean {
    // Auto-retry for network-related errors or certain system errors
    const retryableErrors = [
      'NetworkError',
      'fetch',
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
    ];

    return retryableErrors.some(keyword => 
      error.message.toLowerCase().includes(keyword.toLowerCase()) ||
      error.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private handleRetry = () => {
    if (this.state.errorId) {
      errorLogger.incrementRetryCount(this.state.errorId);
    }

    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1,
    }));
  };

  private handleReset = () => {
    if (this.state.errorId) {
      errorLogger.markErrorResolved(this.state.errorId);
    }

    this.setState({ 
      hasError: false, 
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      errorId: undefined,
    });
  };

  private handleReportError = () => {
    this.setState({ showReportModal: true });
  };

  private getErrorSeverityColor() {
    if (this.props.level === 'page') return 'border-red-500';
    if (this.state.retryCount > 1) return 'border-orange-500';
    return 'border-yellow-500';
  }

  private getRecoveryActions() {
    const actions = [];

    // Retry action
    actions.push(
      <Button 
        key="retry"
        onClick={this.handleRetry} 
        variant="outline" 
        className="flex-1"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        दोबारा कोशिश करें
      </Button>
    );

    // Reset action for repeated failures
    if (this.state.retryCount > 0) {
      actions.push(
        <Button 
          key="reset"
          onClick={this.handleReset} 
          variant="outline" 
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          रीसेट करें
        </Button>
      );
    }

    // Report error action
    if (this.props.enableReporting !== false) {
      actions.push(
        <Button 
          key="report"
          onClick={this.handleReportError} 
          variant="outline" 
          className="flex-1"
        >
          <Bug className="h-4 w-4 mr-2" />
          रिपोर्ट करें
        </Button>
      );
    }

    return actions;
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isPageLevel = this.props.level === 'page';
      const isRepeatedError = this.state.retryCount > 1;

      return (
        <>
          <div className={`min-h-screen flex items-center justify-center p-4 ${isPageLevel ? 'bg-gray-50' : ''}`}>
            <Card className={`w-full max-w-lg shadow-xl border-l-4 ${this.getErrorSeverityColor()}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  {isPageLevel ? 'पृष्ठ लोड नहीं हो सका' : 'कुछ गलत हुआ है'}
                  {isRepeatedError && (
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      दोहराई गई त्रुटि
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  {isPageLevel 
                    ? 'इस पृष्ठ को लोड करने में समस्या हुई है।'
                    : 'एप्लिकेशन के इस हिस्से में एक त्रुटि हुई है।'
                  }
                  {isRepeatedError && ' यह त्रुटि पहले भी हुई है।'}
                </p>

                {this.state.retryCount > 0 && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      कोशिश #{this.state.retryCount + 1} • 
                      पिछली कोशिश {this.state.retryCount === 1 ? 'एक' : this.state.retryCount} बार असफल
                    </p>
                  </div>
                )}

                {/* Recovery actions */}
                {this.props.enableRecovery !== false && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    {this.getRecoveryActions()}
                  </div>
                )}

                {/* Navigation actions for page-level errors */}
                {isPageLevel && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <BackButton className="flex-1" />
                    <Button 
                      onClick={() => window.location.href = '/'} 
                      className="flex-1"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      मुख्य पृष्ठ
                    </Button>
                  </div>
                )}

                {/* Error details for development */}
                {(this.props.showErrorDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                      तकनीकी विवरण {process.env.NODE_ENV === 'development' && '(डेवलपमेंट मोड)'}
                    </summary>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                      <div className="space-y-2">
                        <div><strong>त्रुटि:</strong> {this.state.error.message}</div>
                        {this.state.errorId && (
                          <div><strong>त्रुटि ID:</strong> {this.state.errorId}</div>
                        )}
                        <div><strong>समय:</strong> {new Date().toLocaleString('hi-IN')}</div>
                        {this.state.error.stack && (
                          <details>
                            <summary className="cursor-pointer">Stack Trace</summary>
                            <pre className="mt-1 text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                              {this.state.error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </details>
                )}

                {/* Help text */}
                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  समस्या बनी रहने पर कृपया पेज रीफ्रेश करें या सपोर्ट से संपर्क करें।
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error report modal */}
          {this.props.enableReporting !== false && (
            <ErrorReportModal
              isOpen={this.state.showReportModal}
              onClose={() => this.setState({ showReportModal: false })}
              error={this.state.error}
              errorId={this.state.errorId}
              context={{
                componentStack: this.state.errorInfo?.componentStack,
                errorBoundaryLevel: this.props.level,
                retryCount: this.state.retryCount,
              }}
            />
          )}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithRecovery;
