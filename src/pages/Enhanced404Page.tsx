
import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { NavigationManager } from '@/utils/navigationUtils';
import Layout from '@/components/Layout';

const Enhanced404Page = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Log 404 for analytics
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    
    // You could send this to analytics service here
    // analytics.track('404_error', { path: location.pathname });
  }, [location.pathname]);

  const suggestions = [
    { label: 'मुख्य पृष्ठ', path: '/', icon: Home },
    { label: 'व्याकरण जांचकर्ता', path: '/app', icon: Search },
    { label: 'डैशबोर्ड', path: '/dashboard', icon: Home },
    { label: 'प्रोफाइल', path: '/profile', icon: Home },
  ];

  const handleGoBack = () => {
    if (NavigationManager.canGoBack()) {
      const previousPage = NavigationManager.getPreviousPage();
      if (previousPage) {
        navigate(previousPage.path);
        return;
      }
    }
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl">
          <CardContent className="p-8 text-center">
            {/* 404 Animation */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-gray-300 mb-4 animate-pulse">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              पृष्ठ नहीं मिला
            </h1>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              खुशी! आप एक ऐसे पृष्ठ की तलाश कर रहे हैं जो मौजूद नहीं है। 
              हो सकता है यह पृष्ठ हटा दिया गया हो या URL गलत हो।
            </p>

            {/* Current path info */}
            <div className="bg-gray-100 rounded-lg p-3 mb-6 text-sm text-gray-700">
              <strong>खोजा गया पथ:</strong> <code>{location.pathname}</code>
            </div>

            {/* Navigation suggestions */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                सुझावित पृष्ठ:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.path}
                    to={suggestion.path}
                    className="group"
                  >
                    <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 group-hover:border-blue-300">
                      <CardContent className="p-4 text-center">
                        <suggestion.icon className="h-6 w-6 mx-auto mb-2 text-gray-600 group-hover:text-blue-600" />
                        <span className="text-sm text-gray-700 group-hover:text-blue-700">
                          {suggestion.label}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                वापस जाएं
              </Button>
              <Link to="/">
                <Button className="w-full sm:w-auto flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  मुख्य पृष्ठ
                </Button>
              </Link>
            </div>

            {/* Help text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                अभी भी समस्या हो रही है? 
                <Link to="/contact" className="text-blue-600 hover:underline ml-1">
                  हमसे संपर्क करें
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Enhanced404Page;
