
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            व्याकरणी
          </div>
          <CardTitle className="text-xl">
            लॉगिन करें
          </CardTitle>
          <p className="text-gray-600">अपने खाते में प्रवेश करें</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="आपका पासवर्ड"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "लॉगिन हो रहे हैं..." : "लॉगिन करें"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              खाता नहीं है?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                रजिस्टर करें
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

export default Login;
