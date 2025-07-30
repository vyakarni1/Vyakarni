
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ProfileEditForm from "@/components/Profile/ProfileEditForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Shield, TrendingUp } from "lucide-react";
import UnifiedNavigation from "@/components/UnifiedNavigation";
import Footer from "@/components/Footer";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-96 w-full" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile } = useProfile(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
  }, [user, authLoading, navigate]);

  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <UnifiedNavigation variant="default" />
        <div className="container mx-auto px-6 py-8 pt-24">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const profileCompleteness = [
    profile.name,
    profile.avatar_url,
    profile.phone,
    profile.bio
  ].filter(Boolean).length;

  const handleProfileUpdate = async (updates: any) => {
    await updateProfile(updates);
  };

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
              onProfileUpdate={handleProfileUpdate}
            />
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  खाता सुरक्षा
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">ईमेल पता</span>
                    <span className="text-sm font-medium text-gray-800 truncate ml-2">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-600">ईमेल सत्यापन</span>
                    <span className="text-green-600 text-sm font-medium">✓ सत्यापित</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-600">खाता स्थिति</span>
                    <span className="text-green-600 text-sm font-medium">✓ सक्रिय</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">सदस्य बने</span>
                    <span className="text-gray-600 text-sm">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString('hi-IN') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm text-gray-600">चयनित भाषा</span>
                    <span className="text-blue-600 text-sm font-medium">
                      {profile.preferred_language === 'hindi' ? '🇮🇳 हिंदी' : '🇺🇸 English'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  प्रोफ़ाइल प्रगति
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">प्रोफ़ाइल पूर्णता</p>
                  <div className="relative">
                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${profileCompleteness * 25}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{profileCompleteness * 25}% पूर्ण</span>
                      <span>{profileCompleteness}/4 फ़ील्ड</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className={`flex items-center text-xs ${profile.name ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="mr-2">{profile.name ? '✓' : '○'}</span>
                      नाम
                    </div>
                    <div className={`flex items-center text-xs ${profile.avatar_url ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="mr-2">{profile.avatar_url ? '✓' : '○'}</span>
                      प्रोफ़ाइल फ़ोटो
                    </div>
                    <div className={`flex items-center text-xs ${profile.phone ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="mr-2">{profile.phone ? '✓' : '○'}</span>
                      फ़ोन नंबर
                    </div>
                    <div className={`flex items-center text-xs ${profile.bio ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className="mr-2">{profile.bio ? '✓' : '○'}</span>
                      बायो
                    </div>
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
