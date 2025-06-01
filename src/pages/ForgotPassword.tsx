
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Mail, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { getPasswordResetUrl } from "@/utils/authUtils";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const canSendRequest = () => {
    if (!lastRequestTime) return true;
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    return timeSinceLastRequest > 60000; // 1 minute rate limit
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSendRequest()) {
      toast.error("कृपया अगला रीसेट ईमेल भेजने से पहले एक मिनट प्रतीक्षा करें");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Initiating password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getPasswordResetUrl(),
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      console.log('Password reset email sent successfully');
      setEmailSent(true);
      setLastRequestTime(Date.now());
      toast.success("पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया है!");
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      
      // Handle specific error cases
      if (error.message?.includes('rate_limit')) {
        toast.error("बहुत से अनुरोध भेजे गये हैं। कृपया बाद में पुनः प्रयास करें।");
      } else if (error.message?.includes('user_not_found')) {
        toast.error("इस ईमेल से कोई खाता नहीं मिला");
      } else {
        toast.error(error.message || "ईमेल भेजने में त्रुटि हुई");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    if (canSendRequest()) {
      setEmailSent(false);
      setEmail('');
    } else {
      toast.error("कृपया अगला रीसेट ईमेल भेजने से पहले एक मिनट प्रतीक्षा करें");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-4">
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    वापस
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  पासवर्ड भूल गये?
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  चिंता न करें, हम आपको पासवर्ड रीसेट करने में मदद करेंगे
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">ईमेल पता</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="आपका ईमेल पता दर्ज करें"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !email.trim()}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {isLoading ? "भेजा जा रहा है..." : "रीसेट लिंक भेजें"}
                  </Button>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">सहायता:</p>
                        <ul className="space-y-1">
                          <li>• ईमेल प्राप्त होने में 2-5 मिनट लग सकते हैं</li>
                          <li>• स्पैम फोल्डर की जाँच करें</li>
                          <li>• रीसेट लिंक 24 घंटे तक वैध रहता है</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">ईमेल भेजा गया!</h3>
                    <p className="text-gray-600 mt-2">
                      हमने <strong>{email}</strong> पर पासवर्ड रीसेट लिंक भेजा है।
                      अपना इनबॉक्स चेक करें और लिंक पर क्लिक करके पासवर्ड रीसेट करें।
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    className="w-full"
                    disabled={!canSendRequest()}
                  >
                    {canSendRequest() ? "दूसरा ईमेल भेजें" : "कृपया प्रतीक्षा करें..."}
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                  लॉगिन पेज पर वापस जायें
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
