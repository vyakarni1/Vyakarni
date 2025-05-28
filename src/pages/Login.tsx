
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("कृपया सभी फील्ड भरें");
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("सफलतापूर्वक लॉगिन हो गए!");
        navigate("/dashboard");
      } else {
        toast.error("गलत ईमेल या पासवर्ड");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
