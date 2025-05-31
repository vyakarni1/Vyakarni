
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Lock } from "lucide-react";
import Layout from "@/components/Layout";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyRecoveryToken = async () => {
      // Check for recovery token from Supabase redirect
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      console.log('Recovery token check:', { token: token?.substring(0, 10) + '...', type });
      
      if (!token || type !== 'recovery') {
        console.log('No valid recovery token found, redirecting to forgot-password');
        toast.error("अवैध या समाप्त हो चुका रीसेट लिंक");
        navigate('/forgot-password');
        return;
      }

      try {
        // Verify the recovery token with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'recovery'
        });

        if (error) {
          console.error('Token verification failed:', error);
          toast.error("रीसेट लिंक अमान्य या समाप्त हो गया है");
          navigate('/forgot-password');
          return;
        }

        if (data.session) {
          console.log('Recovery token verified successfully');
          toast.success("रीसेट लिंक सत्यापित हो गया। अब नया पासवर्ड सेट करें।");
        }
      } catch (error) {
        console.error('Error verifying recovery token:', error);
        toast.error("टोकन सत्यापन में त्रुटि");
        navigate('/forgot-password');
      } finally {
        setIsVerifyingToken(false);
      }
    };

    verifyRecoveryToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("पासवर्ड मेल नहीं खाते");
      return;
    }

    if (password.length < 6) {
      toast.error("पासवर्ड कम से कम 6 अक्षर का होना चाहिए");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("पासवर्ड सफलतापूर्वक रीसेट हो गया!");
      navigate('/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || "पासवर्ड रीसेट करने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifyingToken) {
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
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
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
