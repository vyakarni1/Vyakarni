
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, User, Settings, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import PasswordChangeForm from "./PasswordChangeForm";
import AvatarUpload from "./AvatarUpload";
import ProfilePreferences from "./ProfilePreferences";
import AccountDeletion from "./AccountDeletion";
import { useProfileForm } from "@/hooks/useProfileForm";
import { Profile, ProfileFormData } from "@/types/profile";
import { useState } from "react";

interface ProfileEditFormProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate }: ProfileEditFormProps) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const initialFormData: ProfileFormData = useMemo(() => ({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  }), [profile]);

  const handleFormSubmit = async (data: ProfileFormData): Promise<boolean> => {
    try {
      // This would typically be handled by a parent component or hook
      // For now, we'll simulate the API call
      const updatedProfile = { ...profile, ...data };
      onProfileUpdate(updatedProfile);
      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हो गयी!");
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("प्रोफाइल अपडेट करने में त्रुटि");
      return false;
    }
  };

  const {
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    handleSubmit
  } = useProfileForm({
    initialData: initialFormData,
    onSubmit: handleFormSubmit
  });

  const handleAvatarUpdate = (avatarUrl: string) => {
    onProfileUpdate({ ...profile, avatar_url: avatarUrl });
  };

  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>मूल जानकारी</span>
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>प्राथमिकतायें</span>
        </TabsTrigger>
        <TabsTrigger value="danger" className="flex items-center space-x-2">
          <Trash2 className="h-4 w-4" />
          <span>संकटपूर्ण क्षेत्र</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>प्रोफ़ाइल फ़ोटो</CardTitle>
          </CardHeader>
          <CardContent>
            <AvatarUpload 
              currentAvatarUrl={profile?.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              व्यक्तिगत जानकारी
              {isDirty && (
                <div className="flex items-center text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  असहेजे गये परिवर्तन
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">पूरा नाम *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="आपका पूरा नाम"
                    required
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">फोन नंबर</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    type="tel"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">बायो / परिचय</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="अपने बारे में कुछ बतायें..."
                  className={`min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  {errors.bio && <span className="text-red-500">{errors.bio}</span>}
                  <span className="ml-auto">{formData.bio.length}/500</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !isDirty} 
                className="w-full md:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "सहेजा जा रहा है..." : "सहेजें"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <ProfilePreferences 
          profile={profile} 
          onProfileUpdate={onProfileUpdate}
        />
      </TabsContent>

      <TabsContent value="danger" className="space-y-6">
        <AccountDeletion />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              पासवर्ड परिवर्तन
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    अपना खाता पासवर्ड बदलने के लिये यहाँ क्लिक करें। सुरक्षा के लिये आपसे आपका वर्तमान पासवर्ड पूछा जायेगा।
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(true)}
                  className="w-full md:w-auto"
                >
                  पासवर्ड परिवर्तित करें
                </Button>
              </div>
            ) : (
              <PasswordChangeForm onClose={() => setShowPasswordForm(false)} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEditForm;
