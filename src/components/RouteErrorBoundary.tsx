
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import BackButton from './Navigation/BackButton';

interface RouteErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
    
    // Log error for analytics
    this.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  logError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console for development
    console.error('Route Error Details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // In production, you would send this to your error tracking service
    // Example: Sentry, LogRocket, etc.
  };

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            पृष्ठ लोड नहीं हो सका
          </h1>
          <p className="text-gray-600 mb-6">
            इस पृष्ठ को लोड करने में समस्या हुई है। कृपया दोबारा कोशिश करें।
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={retry} className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                दोबारा कोशिश करें
              </Button>
              <BackButton className="flex items-center" />
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                मुख्य पृष्ठ
              </Button>
            </div>
          </div>

          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                डेवलपर जानकारी (केवल डेवलपमेंट में दिखाई देता है)
              </summary>
              <div className="mt-2 p-4 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                <div><strong>Error:</strong> {error.message}</div>
                <div><strong>Location:</strong> {location.pathname}</div>
                <div><strong>Stack:</strong></div>
                <pre className="whitespace-pre-wrap">{error.stack}</pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteErrorBoundary;
