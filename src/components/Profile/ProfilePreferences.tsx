
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import LanguagePreferences from "./Preferences/LanguagePreferences";
import EmailPreferences from "./Preferences/EmailPreferences";
import PrivacySettings from "./Preferences/PrivacySettings";
import { usePreferences } from "@/hooks/usePreferences";

interface ProfilePreferencesProps {
  profile: any;
  onProfileUpdate: (profile: any) => void;
}

const ProfilePreferences = ({ profile, onProfileUpdate }: ProfilePreferencesProps) => {
  const {
    preferences,
    isLoading,
    handlePreferenceChange,
    handleEmailPreferenceChange,
    handlePrivacySettingChange,
    savePreferences
  } = usePreferences(profile, onProfileUpdate);

  return (
    <div className="space-y-6">
      <LanguagePreferences
        preferredLanguage={preferences.preferred_language}
        onLanguageChange={(value) => handlePreferenceChange('preferred_language', value)}
      />

      <EmailPreferences
        emailPreferences={preferences.email_preferences}
        onEmailPreferenceChange={handleEmailPreferenceChange}
      />

      <PrivacySettings
        privacySettings={preferences.privacy_settings}
        onPrivacySettingChange={handlePrivacySettingChange}
      />

      <Button onClick={savePreferences} disabled={isLoading} className="w-full">
        <Settings className="h-4 w-4 mr-2" />
        {isLoading ? "सहेजा जा रहा है..." : "प्राथमिकतायें सहेजें"}
      </Button>
    </div>
  );
};

export default ProfilePreferences;
