
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { 
  enhancedCleanupAuthState, 
  checkLoginRateLimit, 
  recordLoginAttempt,
  getSessionInfo 
} from "@/utils/securityUtils";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ blocked: boolean; remainingTime: number }>({ 
    blocked: false, 
    remainingTime: 0 
  });
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/app");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Check rate limit on email change
    if (email) {
      const rateLimit = checkLoginRateLimit(email);
      if (!rateLimit.allowed && rateLimit.remainingTime) {
        const remainingMinutes = Math.ceil(rateLimit.remainingTime / 60000);
        setRateLimitInfo({ blocked: true, remainingTime: remainingMinutes });
        
        // Set up countdown timer
        const timer = setInterval(() => {
          const currentRateLimit = checkLoginRateLimit(email);
          if (currentRateLimit.allowed) {
            setRateLimitInfo({ blocked: false, remainingTime: 0 });
            clearInterval(timer);
          } else if (currentRateLimit.remainingTime) {
            const minutes = Math.ceil(currentRateLimit.remainingTime / 60000);
            setRateLimitInfo({ blocked: true, remainingTime: minutes });
          }
        }, 60000); // Update every minute

        return () => clearInterval(timer);
      } else {
        setRateLimitInfo({ blocked: false, remainingTime: 0 });
      }
    }
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    const rateLimit = checkLoginRateLimit(email);
    if (!rateLimit.allowed) {
      const remainingMinutes = rateLimit.remainingTime ? Math.ceil(rateLimit.remainingTime / 60000) : 0;
      toast.error(`बहुत अधिक प्रयास। ${remainingMinutes} मिनट बाद कोशिश करें।`);
      return;
    }

    setIsLoading(true);

    try {
      // Clean up any existing auth state
      enhancedCleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Global signout failed, continuing with login');
      }

      // Get session info for security logging
      const sessionInfo = getSessionInfo();
      console.log('Login attempt with session info:', sessionInfo);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        recordLoginAttempt(email, false);
        throw error;
      }

      // Record successful login
      recordLoginAttempt(email, true);
      
      toast.success("सफलतापूर्वक लॉग इन हो गए!");
      
      // Force page reload to ensure clean state
      window.location.href = "/app";
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "लॉग इन में त्रुटि";
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "गलत ईमेल या पासवर्ड";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "कृपया पहले अपना ईमेल सत्यापित करें";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "बहुत अधिक प्रयास। कुछ समय बाद कोशिश करें।";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              होम पर वापस जाएं
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/feb8e6c8-b871-4f30-9ddd-2c20bb223a84.png" 
                  alt="व्याकरणी Logo" 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  व्याकरणी
                </h1>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                वापस आपका स्वागत है!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                अपने खाते में लॉग इन करें
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {rateLimitInfo.blocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">सुरक्षा प्रतीक्षा</p>
                    <p className="text-red-700 text-sm">
                      बहुत अधिक प्रयास के कारण {rateLimitInfo.remainingTime} मिनट प्रतीक्षा करें।
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ईमेल</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="आपका ईमेल पता"
                  required
                  disabled={rateLimitInfo.blocked}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">पासवर्ड</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="आपका पासवर्ड"
                    required
                    disabled={rateLimitInfo.blocked}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={rateLimitInfo.blocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  पासवर्ड भूल गए?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || rateLimitInfo.blocked}
              >
                {isLoading ? "लॉग इन हो रहे हैं..." : "लॉग इन करें"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">या</span>
              </div>
            </div>

            <GoogleAuthButton mode="login" />

            <div className="text-center">
              <span className="text-gray-600">खाता नहीं है? </span>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                रजिस्टर करें
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
