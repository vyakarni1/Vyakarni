
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) newErrors.email = "ईमेल आवश्यक है";
    if (!password) newErrors.password = "पासवर्ड आवश्यक है";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("कृपया सभी फील्ड भरें");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("गलत ईमेल या पासवर्ड");
        } else {
          toast.error("लॉगिन में त्रुटि: " + error.message);
        }
        return;
      }

      if (data.user) {
        toast.success("सफलतापूर्वक लॉगिन हो गए!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("लॉगिन में त्रुटि हुई");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header variant="transparent" />
      
      <div className="flex items-center justify-center min-h-screen p-6 pt-24">
        <Card className="w-full max-w-md animate-scale-in shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-fade-in">
              व्याकरणी
            </div>
            <CardTitle className="text-xl animate-fade-in">
              लॉगिन करें
            </CardTitle>
            <p className="text-gray-600 animate-fade-in">अपने खाते में प्रवेश करें</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="animate-fade-in">
              <GoogleAuthButton mode="login" />
            </div>

            <div className="relative animate-fade-in">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">या</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="email">ईमेल</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ""});
                  }}
                  placeholder="आपका ईमेल"
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:scale-[1.02] ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm animate-fade-in">{errors.email}</p>}
              </div>

              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="password">पासवर्ड</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: ""});
                  }}
                  placeholder="आपका पासवर्ड"
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:scale-[1.02] ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-sm animate-fade-in">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-fade-in" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    लॉगिन हो रहे हैं...
                  </div>
                ) : (
                  "लॉगिन करें"
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center animate-fade-in">
              <p className="text-sm text-gray-600">
                खाता नहीं है?{" "}
                <Link to="/register" className="text-blue-600 hover:underline transition-colors duration-200">
                  रजिस्टर करें
                </Link>
              </p>
              <Link to="/" className="text-sm text-gray-500 hover:underline transition-colors duration-200">
                होम पेज पर वापस जाएं
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
