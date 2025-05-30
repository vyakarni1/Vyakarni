
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Shield } from "lucide-react";
import { toast } from "sonner";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("प्रोफाइल लोड करने में त्रुटि");
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <UnifiedNavigation variant="default" />
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">लोड हो रहा है...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <UnifiedNavigation variant="default" />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <User className="h-8 w-8 mr-3 text-blue-500" />
            प्रोफाइल सेटिंग्स
          </h1>
          <p className="text-gray-600 mt-2">अपनी व्यक्तिगत जानकारी और सेटिंग्स प्रबंधित करें</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Edit Form */}
          <div className="lg:col-span-2">
            <ProfileEditForm 
              profile={profile} 
              onProfileUpdate={setProfile}
            />
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  खाता सुरक्षा
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ईमेल पता</span>
                  <span className="text-sm font-medium text-gray-800">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ईमेल सत्यापन</span>
                  <span className="text-green-600 text-sm font-medium">सत्यापित</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">खाता स्थिति</span>
                  <span className="text-green-600 text-sm font-medium">सक्रिय</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">सदस्य बने</span>
                  <span className="text-gray-600 text-sm">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('hi-IN') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">पसंदीदा भाषा</span>
                  <span className="text-gray-600 text-sm font-medium">
                    {profile?.preferred_language === 'hindi' ? 'हिंदी' : 'English'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-500" />
                  त्वरित जानकारी
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">कुल प्रोफ़ाइल पूर्णता</p>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${[
                            profile?.name,
                            profile?.avatar_url,
                            profile?.phone,
                            profile?.bio
                          ].filter(Boolean).length * 25}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {[profile?.name, profile?.avatar_url, profile?.phone, profile?.bio].filter(Boolean).length}/4 फ़ील्ड पूर्ण
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
