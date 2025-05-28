
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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("कृपया सभी फील्ड भरें");
      return;
    }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            व्याकरणी
          </div>
          <CardTitle className="text-xl">
            रजिस्टर करें
          </CardTitle>
          <p className="text-gray-600">नया खाता बनाएं</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">नाम</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका नाम"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">ईमेल</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="आपका ईमेल"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">पासवर्ड</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="पासवर्ड (कम से कम 6 अक्षर)"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="पासवर्ड दोबारा लिखें"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "रजिस्टर हो रहे हैं..." : "रजिस्टर करें"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              पहले से खाता है?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                लॉगिन करें
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-500 hover:underline">
              होम पेज पर वापस जाएं
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
