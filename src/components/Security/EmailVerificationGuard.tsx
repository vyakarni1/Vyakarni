
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { checkEmailVerification } from '@/utils/securityUtils';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  useEffect(() => {
    const checkVerification = async () => {
      if (user && !loading) {
        const verified = await checkEmailVerification(user);
        setIsVerified(verified);
      }
    };

    checkVerification();
  }, [user, loading]);

  const resendVerificationEmail = async () => {
    if (!user?.email) return;

    // Prevent spam - allow resend only every 60 seconds
    const now = Date.now();
    if (lastSentTime && (now - lastSentTime) < 60000) {
      const remainingTime = Math.ceil((60000 - (now - lastSentTime)) / 1000);
      toast.error(`कृपया ${remainingTime} सेकंड प्रतीक्षा करें`);
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) throw error;

      setLastSentTime(now);
      toast.success('सत्यापन ईमेल दोबारा भेजा गया!');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error('ईमेल भेजने में त्रुटि: ' + error.message);
    } finally {
      setIsResending(false);
    }
  };

  if (loading || isVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-orange-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              ईमेल सत्यापन आवश्यक
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                सुरक्षा कारणों से, कृपया पहले अपना ईमेल सत्यापित करें।
              </p>
              {user?.email && (
                <p className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg">
                  सत्यापन लिंक भेजा गया: <strong>{user.email}</strong>
                </p>
              )}
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-2">सत्यापन के लिए:</p>
                  <ul className="text-xs space-y-1">
                    <li>• अपना ईमेल इनबॉक्स चेक करें</li>
                    <li>• स्पैम फोल्डर भी देखें</li>
                    <li>• सत्यापन लिंक पर क्लिक करें</li>
                    <li>• यह पेज अपने आप अपडेट हो जाएगा</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={resendVerificationEmail} 
                disabled={isResending}
                className="w-full"
                variant="outline"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                    भेजा जा रहा है...
                  </div>
                ) : (
                  'सत्यापन ईमेल दोबारा भेजें'
                )}
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                पेज रीफ्रेश करें
              </Button>
            </div>

            <div className="text-center text-xs text-gray-500">
              <p>समस्या हो रही है? <a href="/contact" className="text-blue-600 hover:underline">सहायता संपर्क करें</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default EmailVerificationGuard;
