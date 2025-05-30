
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import Layout from "@/components/Layout";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया है!");
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(error.message || "ईमेल भेजने में त्रुटि");
    } finally {
      setIsLoading(false);
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
                  पासवर्ड भूल गए?
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
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <Mail className="h-4 w-4 mr-2" />
                    {isLoading ? "भेजा जा रहा है..." : "रीसेट लिंक भेजें"}
                  </Button>
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
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="w-full"
                  >
                    दूसरा ईमेल भेजें
                  </Button>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm">
                  लॉगिन पेज पर वापस जाएं
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
