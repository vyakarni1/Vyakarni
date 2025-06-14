
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertTriangle, CheckCircle, Clock, Smartphone, Globe, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { forceLogoutAllDevices, getSessionInfo, checkEmailVerification } from '@/utils/securityUtils';
import { toast } from 'sonner';

interface SecurityStatus {
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  strongPassword: boolean;
  recentLoginActivity: boolean;
  securityScore: number;
}

const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    emailVerified: false,
    twoFactorEnabled: false,
    strongPassword: false,
    recentLoginActivity: false,
    securityScore: 0
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const assessSecurity = async () => {
      if (!user) return;

      const emailVerified = await checkEmailVerification(user);
      const sessionInfo = getSessionInfo();
      
      // Calculate security score based on various factors
      let score = 0;
      if (emailVerified) score += 25;
      if (user.email) score += 25; // Has email
      // Add more security checks as needed
      
      setSecurityStatus({
        emailVerified,
        twoFactorEnabled: false, // TODO: Implement 2FA checking
        strongPassword: false, // TODO: Implement password strength checking
        recentLoginActivity: true, // Current session is recent
        securityScore: score
      });
    };

    assessSecurity();
  }, [user]);

  const handleForceLogoutAll = async () => {
    setIsLoggingOut(true);
    try {
      const result = await forceLogoutAllDevices();
      if (result.success) {
        toast.success('सभी डिवाइस से सफलतापूर्वक लॉग आउट हो गए');
      } else {
        toast.error('लॉग आउट करने में समस्या हुई');
      }
    } catch (error) {
      toast.error('लॉग आउट करने में त्रुटि');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score < 50) return 'text-red-600';
    if (score < 75) return 'text-orange-600';
    return 'text-green-600';
  };

  const getSecurityScoreText = (score: number) => {
    if (score < 50) return 'कमजोर';
    if (score < 75) return 'मध्यम';
    return 'मजबूत';
  };

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            सुरक्षा स्कोर
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getSecurityScoreColor(securityStatus.securityScore)}`}>
                {securityStatus.securityScore}/100
              </div>
              <p className="text-sm text-gray-600">
                आपकी खाता सुरक्षा {getSecurityScoreText(securityStatus.securityScore)} है
              </p>
            </div>
            <div className="text-right">
              <Badge variant={securityStatus.securityScore >= 75 ? "default" : "destructive"}>
                {getSecurityScoreText(securityStatus.securityScore)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Status Items */}
      <Card>
        <CardHeader>
          <CardTitle>सुरक्षा स्थिति</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {securityStatus.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">ईमेल सत्यापन</p>
                  <p className="text-sm text-gray-600">
                    {securityStatus.emailVerified ? 'सत्यापित' : 'सत्यापन आवश्यक'}
                  </p>
                </div>
              </div>
              <Badge variant={securityStatus.emailVerified ? "default" : "destructive"}>
                {securityStatus.emailVerified ? 'सक्रिय' : 'आवश्यक'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">द्विकारक प्रमाणीकरण (2FA)</p>
                  <p className="text-sm text-gray-600">अतिरिक्त सुरक्षा परत</p>
                </div>
              </div>
              <Badge variant="secondary">जल्द आएगा</Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">हाल की गतिविधि</p>
                  <p className="text-sm text-gray-600">लॉगिन गतिविधि निगरानी</p>
                </div>
              </div>
              <Badge variant="default">सक्रिय</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>सुरक्षा कार्रवाइयां</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={handleForceLogoutAll}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'लॉग आउट हो रहा है...' : 'सभी डिवाइस से लॉग आउट करें'}
            </Button>
            
            <Button variant="outline" className="justify-start" disabled>
              <Globe className="h-4 w-4 mr-2" />
              सक्रिय सत्र देखें (जल्द आएगा)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">सुरक्षा सुझाव</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            {!securityStatus.emailVerified && (
              <p>• अपना ईमेल पता सत्यापित करें</p>
            )}
            <p>• मजबूत और अनोखा पासवर्ड उपयोग करें</p>
            <p>• नियमित रूप से पासवर्ड बदलें</p>
            <p>• सार्वजनिक WiFi पर संवेदनशील कार्य न करें</p>
            <p>• संदिग्ध गतिविधि की तुरंत रिपोर्ट करें</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
