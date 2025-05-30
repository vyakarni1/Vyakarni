
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PreferencesState {
  preferred_language: string;
  email_preferences: {
    marketing: boolean;
    system: boolean;
    security: boolean;
  };
  privacy_settings: {
    profile_visibility: 'private' | 'public';
    activity_status: boolean;
  };
}

export const usePreferences = (profile: any, onProfileUpdate: (profile: any) => void) => {
  const [preferences, setPreferences] = useState<PreferencesState>({
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

  return {
    preferences,
    isLoading,
    handlePreferenceChange,
    handleEmailPreferenceChange,
    handlePrivacySettingChange,
    savePreferences
  };
};
