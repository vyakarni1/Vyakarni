
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import GrammarChecker from "@/components/GrammarChecker";
import WordBalanceDisplayEnhanced from "@/components/WordBalanceDisplayEnhanced";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [componentError, setComponentError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    const addDebugInfo = (info: string) => {
      console.log(`[Index Debug]: ${info}`);
      setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    addDebugInfo("Index component mounted");
    addDebugInfo(`Auth loading: ${loading}, User: ${user ? 'exists' : 'null'}`);
    
    if (!loading && !user) {
      addDebugInfo("No user found, redirecting to login");
      navigate("/login");
      return;
    }
    
    if (user) {
      addDebugInfo(`User authenticated: ${user.email}`);
    }

    if (loading) {
      addDebugInfo("Showing loading state");
    } else {
      addDebugInfo("Rendering main content");
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600">लोड हो रहा है...</p>
            <div className="mt-4 text-xs text-gray-400">
              <p>प्रमाणीकरण की जांच की जा रही है...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if there's a component error
  if (componentError) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">एप्लिकेशन लोड नहीं हो सका</h2>
              <p className="text-gray-600 mb-4">{componentError}</p>
              <details className="text-left text-xs text-gray-500 mb-4">
                <summary>डिबग जानकारी</summary>
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index}>{info}</div>
                  ))}
                </div>
              </details>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                पेज रीफ्रेश करें
              </button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto py-4 sm:py-8">
            <ErrorBoundary fallback={
              <Card className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p>शब्द बैलेंस डिस्प्ले लोड नहीं हो सका</p>
              </Card>
            }>
              <WordBalanceDisplayEnhanced />
            </ErrorBoundary>
            
            <ErrorBoundary fallback={
              <Card className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p>व्याकरण चेकर लोड नहीं हो सका</p>
              </Card>
            }>
              <GrammarChecker />
            </ErrorBoundary>
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
};

export default Index;
