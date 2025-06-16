
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyResetToken = async () => {
      console.log('Verifying reset token...');
      console.log('URL params:', Object.fromEntries(searchParams.entries()));
      
      // Check for Supabase reset token parameters
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');
      
      // If we have token_hash and type=recovery, verify with Supabase
      if (token_hash && type === 'recovery') {
        try {
          console.log('Verifying token with Supabase...');
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery'
          });
          
          if (error) {
            console.error('Token verification error:', error);
            toast.error("रीसेट लिंक अमान्य या समाप्त हो गया है");
            navigate("/forgot-password");
            return;
          }
          
          if (data.session) {
            console.log('Token verified successfully');
            setIsValidToken(true);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          toast.error("टोकन सत्यापन में त्रुटि");
          navigate("/forgot-password");
        }
      }
      // Legacy support for access_token/refresh_token format
      else if (access_token && refresh_token) {
        try {
          console.log('Setting session with access/refresh tokens...');
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });
          
          if (error) {
            console.error('Session setting error:', error);
            toast.error("रीसेट लिंक अमान्य या समाप्त हो गया है");
            navigate("/forgot-password");
            return;
          }
          
          if (data.session) {
            console.log('Session set successfully');
            setIsValidToken(true);
          }
        } catch (error) {
          console.error('Session setting failed:', error);
          toast.error("सेशन सेट करने में त्रुटि");
          navigate("/forgot-password");
        }
      }
      else {
        console.log('No valid reset parameters found');
        toast.error("अमान्य रीसेट लिंक");
        navigate("/forgot-password");
      }
      
      setIsVerifying(false);
    };

    verifyResetToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("पासवर्ड मैच नहीं कर रहे");
      return;
    }

    if (password.length < 6) {
      toast.error("पासवर्ड कम से कम 6 अक्षर का होना चाहिए");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success("पासवर्ड सफलतापूर्वक बदल दिया गया!");
      
      // Sign out and redirect to login
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "पासवर्ड अपडेट करने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">रीसेट लिंक सत्यापित की जा रही है...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                अमान्य लिंक
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-gray-600">
                <p>यह रीसेट लिंक अमान्य है या समाप्त हो गया है।</p>
                <p className="mt-2">कृपया नया रीसेट लिंक का अनुरोध करें।</p>
              </div>
              <Button 
                onClick={() => navigate("/forgot-password")} 
                className="w-full"
              >
                नया रीसेट लिंक मांगें
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="h-16 w-16 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                नया पासवर्ड सेट करें
              </CardTitle>
              <p className="text-gray-600 mt-2">
                कृपया अपना नया पासवर्ड दर्ज करें
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">नया पासवर्ड</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="कम से कम 6 अक्षर"
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
                    placeholder="पासवर्ड दोबारा डालें"
                    required
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
                {isLoading ? "पासवर्ड अपडेट हो रहा है..." : "पासवर्ड अपडेट करें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
