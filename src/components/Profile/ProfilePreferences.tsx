
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Globe, Bell, Shield } from "lucide-react";

interface ProfilePreferencesProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfilePreferences = ({ profile, onProfileUpdate }: ProfilePreferencesProps) => {
  const [preferences, setPreferences] = useState({
    preferred_language: profile?.preferred_language || 'hindi',
    email_preferences: {
      marketing: profile?.email_preferences?.marketing ?? true,
      system: profile?.email_preferences?.system ?? true,
      security: profile?.email_preferences?.security ?? true,
    },
    privacy_settings: {
      profile_visibility: profile?.privacy_settings?.profile_visibility || 'private',
      activity_status: profile?.privacy_settings?.activity_status ?? true,
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEmailPreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      email_preferences: {
        ...prev.email_preferences,
        [key]: value
      }
    }));
  };

  const handlePrivacySettingChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy_settings: {
        ...prev.privacy_settings,
        [key]: value
      }
    }));
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          preferred_language: preferences.preferred_language,
          email_preferences: preferences.email_preferences,
          privacy_settings: preferences.privacy_settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      onProfileUpdate(data);
      toast.success("प्राथमिकताएं सफलतापूर्वक सहेजी गईं!");
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error("प्राथमिकताएं सहेजने में त्रुटि");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-500" />
            भाषा की प्राथमिकताएं
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">पसंदीदा भाषा</Label>
            <Select
              value={preferences.preferred_language}
              onValueChange={(value) => handlePreferenceChange('preferred_language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="भाषा चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hindi">हिंदी</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-green-500" />
            ईमेल प्राथमिकताएं
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>मार्केटिंग ईमेल</Label>
              <p className="text-sm text-gray-500">नई सुविधाओं और ऑफर की जानकारी</p>
            </div>
            <Switch
              checked={preferences.email_preferences.marketing}
              onCheckedChange={(checked) => handleEmailPreferenceChange('marketing', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>सिस्टम ईमेल</Label>
              <p className="text-sm text-gray-500">खाता और सेवा अपडेट</p>
            </div>
            <Switch
              checked={preferences.email_preferences.system}
              onCheckedChange={(checked) => handleEmailPreferenceChange('system', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>सुरक्षा अलर्ट</Label>
              <p className="text-sm text-gray-500">लॉगिन और सुरक्षा संबंधी जानकारी</p>
            </div>
            <Switch
              checked={preferences.email_preferences.security}
              onCheckedChange={(checked) => handleEmailPreferenceChange('security', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-500" />
            गोपनीयता सेटिंग्स
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>प्रोफ़ाइल दृश्यता</Label>
            <Select
              value={preferences.privacy_settings.profile_visibility}
              onValueChange={(value) => handlePrivacySettingChange('profile_visibility', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">निजी</SelectItem>
                <SelectItem value="public">सार्वजनिक</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>गतिविधि स्थिति</Label>
              <p className="text-sm text-gray-500">अपनी ऑनलाइन स्थिति दिखाएं</p>
            </div>
            <Switch
              checked={preferences.privacy_settings.activity_status}
              onCheckedChange={(checked) => handlePrivacySettingChange('activity_status', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={savePreferences} disabled={isLoading} className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        {isLoading ? "सहेजा जा रहा है..." : "प्राथमिकताएं सहेजें"}
      </Button>
    </div>
  );
};

export default ProfilePreferences;
