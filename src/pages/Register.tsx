import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("ईमेल आवश्यक है");
      return;
    }
    if (!password) {
      toast.error("पासवर्ड आवश्यक है");
      return;
    }
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
      const {
        error
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim() || null // Allow empty name
          }
        }
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।");
        } else {
          toast.error("रजिस्ट्रेशन में त्रुटि: " + error.message);
        }
        return;
      }
      toast.success("रजिस्ट्रेशन सफल! कृपया अपना ईमेल चेक करें।");
      navigate("/login");
    } catch (error) {
      toast.error("रजिस्ट्रेशन में त्रुटि हुई");
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            व्याकरणी में शामिल हों
          </CardTitle>
          <CardDescription className="text-gray-600">नया खाता बनायें और व्याकरण एवं लेखन सुधार का आरंभ करें</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                ईमेल पता <span className="text-red-500">*</span>
              </Label>
              <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="transition-all duration-200 focus:scale-105 border-gray-300 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                नाम <span className="text-gray-400">(वैकल्पिक)</span>
              </Label>
              <Input id="name" type="text" placeholder="आपका नाम" value={name} onChange={e => setName(e.target.value)} className="transition-all duration-200 focus:scale-105 border-gray-300 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                पासवर्ड <span className="text-red-500">*</span>
              </Label>
              <Input id="password" type="password" placeholder="कम से कम 6 अक्षर" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="transition-all duration-200 focus:scale-105 border-gray-300 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                पासवर्ड की पुष्टि करें <span className="text-red-500">*</span>
              </Label>
              <Input id="confirmPassword" type="password" placeholder="पासवर्ड दोबारा डालें" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="transition-all duration-200 focus:scale-105 border-gray-300 focus:border-blue-500" />
            </div>

            <Button type="submit" className="w-full transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg" disabled={isLoading}>
              {isLoading ? <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  रजिस्टर हो रहे हैं...
                </div> : "रजिस्टर करें"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              पहले से खाता है?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                लॉगिन करें
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Register;