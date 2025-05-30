
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

interface PrivacySettingsProps {
  privacySettings: {
    profile_visibility: 'private' | 'public';
    activity_status: boolean;
  };
  onPrivacySettingChange: (key: string, value: any) => void;
}

const PrivacySettings = ({ privacySettings, onPrivacySettingChange }: PrivacySettingsProps) => {
  return (
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
            value={privacySettings.profile_visibility}
            onValueChange={(value) => onPrivacySettingChange('profile_visibility', value)}
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
            checked={privacySettings.activity_status}
            onCheckedChange={(checked) => onPrivacySettingChange('activity_status', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
