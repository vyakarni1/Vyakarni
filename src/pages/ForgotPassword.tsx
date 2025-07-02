import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("रीसेट लिंक आपके ईमेल पर भेज दिया गया है!");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "रीसेट लिंक भेजने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/1bf69a70-2442-4bb2-8681-6877bdaeec2d.png"
                  alt="व्याकरणी Logo" 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  व्याकरणी
                </h1>
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                ईमेल भेज दिया गया!
              </CardTitle>
              <p className="text-gray-600 mt-2">
                पासवर्ड रीसेट का लिंक आपके ईमेल <strong>{email}</strong> पर भेज दिया गया है।
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  कृपया अपना ईमेल चेक करें और रीसेट लिंक पर क्लिक करें। यदि आपको ईमेल नहीं मिला है तो स्पैम फोल्डर भी देखें।
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                  className="w-full"
                >
                  दूसरा ईमेल पता आज़माएं
                </Button>
                
                <Link to="/login">
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    लॉगिन पर वापस जाएं
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              लॉगिन पर वापस जाएं
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/1bf69a70-2442-4bb2-8681-6877bdaeec2d.png" 
                  alt="व्याकरणी Logo" 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  व्याकरणी
                </h1>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                पासवर्ड भूल गए?
              </CardTitle>
              <p className="text-gray-600 mt-2">
                चिंता न करें! अपना ईमेल पता डालें और हम आपको रीसेट लिंक भेजेंगे।
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">ईमेल पता</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="आपका ईमेल पता डालें"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "भेजा जा रहा है..." : "पासवर्ड रीसेट लिंक भेजें"}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-gray-600">पासवर्ड याद आ गया? </span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                लॉगिन करें
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;