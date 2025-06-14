
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const VerifyEmail = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type === 'email') {
      verifyEmail(token_hash);
    } else {
      setIsVerifying(false);
      setVerificationStatus('pending');
    }
  }, [searchParams]);

  const verifyEmail = async (tokenHash: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email'
      });

      if (error) throw error;

      setVerificationStatus('success');
      toast.success("ईमेल सफलतापूर्वक सत्यापित हो गया!");
      
      setTimeout(() => {
        navigate("/app");
      }, 2000);
    } catch (error: any) {
      console.error("Email verification error:", error);
      setVerificationStatus('error');
      toast.error("ईमेल सत्यापन में त्रुटि");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) {
      toast.error("ईमेल पता नहीं मिला");
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

      toast.success("सत्यापन ईमेल दोबारा भेजा गया!");
    } catch (error: any) {
      console.error("Resend verification error:", error);
      toast.error("ईमेल भेजने में त्रुटि");
    } finally {
      setIsResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">ईमेल सत्यापित हो रहा है...</h2>
            <p className="text-gray-600">कृपया प्रतीक्षा करें।</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">ईमेल सत्यापित!</h2>
            <p className="text-gray-600 mb-4">आपका ईमेल पता सफलतापूर्वक सत्यापित हो गया है।</p>
            <p className="text-sm text-gray-500">आप डैशबोर्ड पर रीडायरेक्ट हो रहे हैं...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">सत्यापन असफल</h2>
            <p className="text-gray-600 mb-4">ईमेल सत्यापन में समस्या हुई। लिंक समाप्त हो गया हो सकता है।</p>
            <div className="space-y-2">
              <Button onClick={resendVerificationEmail} disabled={isResending} className="w-full">
                {isResending ? "भेजा जा रहा है..." : "नया सत्यापन ईमेल भेजें"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/login")} className="w-full">
                लॉगिन पेज पर जाएं
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            ईमेल सत्यापन आवश्यक
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              कृपया अपना ईमेल चेक करें और सत्यापन लिंक पर क्लिक करें।
            </p>
            {user?.email && (
              <p className="text-sm text-gray-500 mb-4">
                सत्यापन ईमेल भेजा गया: <strong>{user.email}</strong>
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={resendVerificationEmail} 
              disabled={isResending}
              className="w-full"
            >
              {isResending ? "भेजा जा रहा है..." : "सत्यापन ईमेल दोबारा भेजें"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")}
              className="w-full"
            >
              लॉगिन पेज पर वापस जाएं
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>अगर ईमेल नहीं मिला तो स्पैम फोल्डर चेक करें।</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
