
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useUserRole } from '@/hooks/useUserRole';
import { checkEmailVerification } from '@/utils/securityUtils';
import { shouldRedirect, ROUTE_METADATA } from '@/utils/navigationUtils';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavigationLoader from './Navigation/NavigationLoader';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRouteAccess = async () => {
      setIsLoading(true);

      // Check for route redirects first
      const redirectPath = shouldRedirect(location.pathname);
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        return;
      }

      const metadata = ROUTE_METADATA[location.pathname];
      
      // If no metadata, allow access (probably a valid route without specific requirements)
      if (!metadata) {
        setIsLoading(false);
        return;
      }

      // Check authentication requirement
      if (metadata.requiresAuth && !authLoading && !user) {
        navigate('/login', { state: { from: location.pathname } });
        return;
      }

      // Check role requirements
      if (metadata.requiredRoles && metadata.requiredRoles.length > 0) {
        if (roleLoading) return; // Wait for role to load
        
        const hasRequiredRole = metadata.requiredRoles.some(role => 
          userRole?.role === role
        );
        
        if (!hasRequiredRole) {
          navigate('/dashboard', { replace: true });
          return;
        }
      }

      // Check email verification requirement
      if (metadata.requiresEmailVerification && user) {
        if (isVerified === null) {
          const verified = await checkEmailVerification(user);
          setIsVerified(verified);
          if (!verified) {
            // Will be handled by the email verification guard in the component
            setIsLoading(false);
            return;
          }
        }
      }

      setIsLoading(false);
    };

    checkRouteAccess();
  }, [user, authLoading, userRole, roleLoading, location.pathname, navigate, isVerified]);

  if (isLoading || authLoading || roleLoading) {
    return <NavigationLoader isLoading={true} message="रूट सत्यापन हो रहा है..." />;
  }

  const metadata = ROUTE_METADATA[location.pathname];
  
  // If route requires email verification and user is not verified
  if (metadata?.requiresEmailVerification && user && isVerified === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ईमेल सत्यापन आवश्यक</h2>
            <p className="text-gray-600 mb-4">
              इस पृष्ठ तक पहुंचने के लिए कृपया पहले अपना ईमेल सत्यापित करें।
            </p>
            <Button onClick={() => navigate('/security')}>
              सुरक्षा सेटिंग्स पर जाएं
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
