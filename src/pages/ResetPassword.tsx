
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { parseResetPasswordParams, validateResetPasswordAccess } from "@/utils/authUtils";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyResetAccess = async () => {
      setIsVerifyingAccess(true);
      
      try {
        const params = parseResetPasswordParams(searchParams);
        const validation = validateResetPasswordAccess(params);
        
        console.log('Reset password access validation:', validation);
        
        if (!validation.isValid) {
          console.error('Invalid reset password access:', validation.error);
          
          let errorMsg = "अवैध या समाप्त हो चुका रीसेट लिंक";
          
          if (validation.error === 'access_denied') {
            errorMsg = "रीसेट लिंक की अनुमति नहीं दी गई";
          } else if (validation.error === 'otp_expired') {
            errorMsg = "रीसेट लिंक समाप्त हो गया है";
          } else if (params.errorDescription) {
            errorMsg = "रीसेट लिंक अमान्य या समाप्त हो गया है";
          }
          
          setErrorMessage(errorMsg);
          setHasValidAccess(false);
          toast.error(errorMsg);
          
          // Redirect after showing error
          setTimeout(() => {
            navigate('/forgot-password');
          }, 3000);
          return;
        }

        // If we have access token and refresh token, set the session
        if (params.accessToken && params.refreshToken) {
          console.log('Setting session with tokens');
          const { error } = await supabase.auth.setSession({
            access_token: params.accessToken,
            refresh_token: params.refreshToken
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setErrorMessage("प्रमाणीकरण में त्रुटि");
            setHasValidAccess(false);
            toast.error("प्रमाणीकरण में त्रुटि");
            setTimeout(() => navigate('/forgot-password'), 3000);
            return;
          }
        }

        setHasValidAccess(true);
        toast.success("रीसेट लिंक सत्यापित हो गया। अब नया पासवर्ड सेट करें।");
        
      } catch (error) {
        console.error('Error during reset password verification:', error);
        setErrorMessage("प्रमाणीकरण में त्रुटि");
        setHasValidAccess(false);
        toast.error("प्रमाणीकरण में त्रुटि");
        setTimeout(() => navigate('/forgot-password'), 3000);
      } finally {
        setIsVerifyingAccess(false);
      }
    };

    verifyResetAccess();
  }, [searchParams, navigate]);

  const validatePassword = (pwd: string) => {
    const minLength = pwd.length >= 6;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    
    return {
      minLength,
      hasUpperCase,
      hasNumber,
      isValid: minLength && hasUpperCase && hasNumber
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("पासवर्ड मेल नहीं खाते");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      toast.error("पासवर्ड आवश्यकताओं को पूरा नहीं करता");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        throw error;
      }

      console.log('Password updated successfully');
      toast.success("पासवर्ड सफलतापूर्वक रीसेट हो गया!");
      
      // Clear the form
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      if (error.message?.includes('session_not_found')) {
        toast.error("सत्र समाप्त हो गया। कृपया नया रीसेट लिंक मांगें।");
        setTimeout(() => navigate('/forgot-password'), 2000);
      } else {
        toast.error(error.message || "पासवर्ड रीसेट करने में त्रुटि");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">रीसेट लिंक सत्यापित हो रहा है...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasValidAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-bold text-red-600">
                  रीसेट लिंक अमान्य
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">{errorMessage}</p>
                <Button 
                  onClick={() => navigate('/forgot-password')}
                  className="w-full"
                >
                  नया रीसेट लिंक मांगें
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const passwordValidation = validatePassword(password);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  नया पासवर्ड सेट करें
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  अपना नया पासवर्ड दर्ज करें
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">नया पासवर्ड</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="नया पासवर्ड दर्ज करें"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {password && (
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">पासवर्ड की आवश्यकतायें:</Label>
                    <div className="space-y-1">
                      <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        कम से कम 6 अक्षर
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        कम से कम एक बड़ा अक्षर
                      </div>
                      <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        कम से कम एक संख्या
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="पासवर्ड की पुष्टि करें"
                      required
                      minLength={6}
                      className={confirmPassword && password !== confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">पासवर्ड मेल नहीं खाते</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
                >
                  {isLoading ? "अपडेट हो रहा है..." : "पासवर्ड अपडेट करें"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
