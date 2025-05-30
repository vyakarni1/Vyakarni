
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, User, Settings, Lock, Trash2 } from "lucide-react";
import PasswordChangeForm from "./PasswordChangeForm";
import AvatarUpload from "./AvatarUpload";
import ProfilePreferences from "./ProfilePreferences";
import AccountDeletion from "./AccountDeletion";

interface ProfileEditFormProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfileEditForm = ({ profile, onProfileUpdate }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      toast.success("प्रोफाइल सफलतापूर्वक अपडेट हो गई!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("प्रोफाइल अपडेट करने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    onProfileUpdate({ ...profile, avatar_url: avatarUrl });
  };

  return (
    <Tabs defaultValue="basic" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>मूल जानकारी</span>
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>प्राथमिकताएं</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>सुरक्षा</span>
        </TabsTrigger>
        <TabsTrigger value="danger" className="flex items-center space-x-2">
          <Trash2 className="h-4 w-4" />
          <span>खतरनाक क्षेत्र</span>
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
            <CardTitle>व्यक्तिगत जानकारी</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">पूरा नाम *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="आपका पूरा नाम"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">फोन नंबर</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 9876543210"
                    type="tel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">बायो / परिचय</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="अपने बारे में कुछ बताएं..."
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "सहेजा जा रहा है..." : "सहेजें"}
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

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              पासवर्ड बदलें
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showPasswordForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(true)}
                className="w-full md:w-auto"
              >
                पासवर्ड बदलें
              </Button>
            ) : (
              <div className="space-y-4">
                <PasswordChangeForm onClose={() => setShowPasswordForm(false)} />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="danger" className="space-y-6">
        <AccountDeletion />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEditForm;
