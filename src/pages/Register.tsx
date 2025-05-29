
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
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

    if (!name.trim()) newErrors.name = "नाम आवश्यक है";
    if (!email.trim()) newErrors.email = "ईमेल आवश्यक है";
    if (!password) newErrors.password = "पासवर्ड आवश्यक है";
    if (password.length < 6) newErrors.password = "पासवर्ड कम से कम 6 अक्षर का होना चाहिए";
    if (password !== confirmPassword) newErrors.confirmPassword = "पासवर्ड मेल नहीं खाते";
    if (!acceptTerms) newErrors.acceptTerms = "सेवा की शर्तों और गोपनीयता नीति को स्वीकार करना आवश्यक है";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        if (error.message === "User already registered") {
          toast.error("यह ईमेल पहले से रजिस्टर है");
        } else {
          toast.error("रजिस्ट्रेशन में त्रुटि: " + error.message);
        }
        return;
      }

      if (data.user) {
        toast.success("सफलतापूर्वक रजिस्टर हो गए!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("रजिस्ट्रेशन में त्रुटि हुई");
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
              रजिस्टर करें
            </CardTitle>
            <p className="text-gray-600 animate-fade-in">नया खाता बनाएं</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name">नाम</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({...errors, name: ""});
                  }}
                  placeholder="आपका नाम"
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:scale-[1.02] ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm animate-fade-in">{errors.name}</p>}
              </div>

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
                  placeholder="पासवर्ड (कम से कम 6 अक्षर)"
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:scale-[1.02] ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-sm animate-fade-in">{errors.password}</p>}
              </div>

              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                  }}
                  placeholder="पासवर्ड दोबारा लिखें"
                  disabled={isLoading}
                  className={`transition-all duration-200 focus:scale-[1.02] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm animate-fade-in">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2 animate-fade-in">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="acceptTerms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => {
                      setAcceptTerms(checked as boolean);
                      if (errors.acceptTerms) setErrors({...errors, acceptTerms: ""});
                    }}
                    disabled={isLoading}
                    className={`mt-1 transition-all duration-200 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                  />
                  <div className="text-sm leading-relaxed">
                    <label htmlFor="acceptTerms" className="text-gray-700 cursor-pointer">
                      मैं{" "}
                      <Link to="/terms" className="text-blue-600 hover:underline transition-colors duration-200">
                        सेवा की शर्तों
                      </Link>
                      {" "}और{" "}
                      <Link to="/privacy" className="text-blue-600 hover:underline transition-colors duration-200">
                        गोपनीयता नीति
                      </Link>
                      {" "}से सहमत हूं।
                    </label>
                  </div>
                </div>
                {errors.acceptTerms && <p className="text-red-500 text-sm animate-fade-in">{errors.acceptTerms}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-fade-in" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    रजिस्टर हो रहे हैं...
                  </div>
                ) : (
                  "रजिस्टर करें"
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center animate-fade-in">
              <p className="text-sm text-gray-600">
                पहले से खाता है?{" "}
                <Link to="/login" className="text-blue-600 hover:underline transition-colors duration-200">
                  लॉगिन करें
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

export default Register;
