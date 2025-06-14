
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Smartphone, AlertTriangle, Clock, Globe } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SecurityDashboard from "@/components/Security/SecurityDashboard";

const SecuritySettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const handleLogoutAllDevices = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      toast.success("सभी डिवाइस से लॉग आउट हो गए!");
      window.location.href = '/login';
    } catch (error: any) {
      toast.error("लॉग आउट करने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  const mockSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Mumbai, India",
      lastActive: "अभी सक्रिय",
      current: true
    },
    {
      id: 2,
      device: "Mobile App",
      location: "Delhi, India", 
      lastActive: "2 घंटे पहले",
      current: false
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-500" />
              सुरक्षा सेटिंग्स
            </h1>
            <p className="text-gray-600 mt-2">अपने खाते की सुरक्षा और गोपनीयता प्रबंधित करें</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column: Security Dashboard */}
            <div className="lg:col-span-2">
              <SecurityDashboard />
            </div>

            {/* Right column: Settings */}
            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-green-500" />
                    द्विकारक प्रमाणीकरण (2FA)
                    <Badge variant={twoFactorEnabled ? "default" : "secondary"} className="ml-2">
                      {twoFactorEnabled ? "सक्रिय" : "निष्क्रिय"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2FA सक्षम करें</p>
                      <p className="text-sm text-gray-600">अतिरिक्त सुरक्षा के लिए</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                      disabled
                    />
                  </div>

                  {twoFactorEnabled && (
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center text-green-800">
                        <Smartphone className="h-4 w-4 mr-2" />
                        <span className="font-medium">Authenticator App</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Google Authenticator या समान ऐप का उपयोग करके सेटअप किया गया
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        बैकअप कोड देखें
                      </Button>
                    </div>
                  )}

                  {!twoFactorEnabled && (
                    <Button className="w-full" disabled>
                      2FA सेटअप करें (जल्द आएगा)
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Login & Security Notifications */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    सुरक्षा अलर्ट
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">लॉगिन अधिसूचना</p>
                      <p className="text-sm text-gray-600">नए डिवाइस से लॉगिन पर अलर्ट</p>
                    </div>
                    <Switch
                      checked={loginNotifications}
                      onCheckedChange={setLoginNotifications}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>सत्र टाइमआउट (मिनट)</Label>
                    <Input
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(Number(e.target.value))}
                      min="5"
                      max="480"
                    />
                    <p className="text-xs text-gray-500">
                      निष्क्रियता के बाद कितनी देर में लॉग आउट करें
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Sessions */}
            <Card className="shadow-lg lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-500" />
                    सक्रिय सत्र
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogoutAllDevices}
                    disabled={isLoading}
                  >
                    सभी से लॉग आउट करें
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Globe className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-gray-600">{session.location}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{session.lastActive}</span>
                            {session.current && (
                              <Badge variant="default" className="text-xs">
                                वर्तमान सत्र
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="outline" size="sm" disabled>
                          समाप्त करें
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Recommendations */}
            <Card className="shadow-lg lg:col-span-3 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Shield className="h-5 w-5 mr-2" />
                  सुरक्षा सुझाव
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">मजबूत पासवर्ड</p>
                    <p className="text-sm text-orange-700">
                      कम से कम 8 अक्षर, अंक और विशेष चिह्न शामिल करें
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">नियमित अपडेट</p>
                    <p className="text-sm text-orange-700">
                      अपना पासवर्ड हर 3-6 महीने में बदलें
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">सार्वजनिक WiFi</p>
                    <p className="text-sm text-orange-700">
                      सार्वजनिक नेटवर्क पर संवेदनशील कार्य न करें
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-orange-800">नियमित जांच</p>
                    <p className="text-sm text-orange-700">
                      सक्रिय सत्रों की नियमित समीक्षा करें
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecuritySettings;
