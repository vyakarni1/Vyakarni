
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

interface EmailPreferencesProps {
  emailPreferences: {
    marketing: boolean;
    system: boolean;
    security: boolean;
  };
  onEmailPreferenceChange: (key: string, value: boolean) => void;
}

const EmailPreferences = ({ emailPreferences, onEmailPreferenceChange }: EmailPreferencesProps) => {
  return (
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
            checked={emailPreferences.marketing}
            onCheckedChange={(checked) => onEmailPreferenceChange('marketing', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>सिस्टम ईमेल</Label>
            <p className="text-sm text-gray-500">खाता और सेवा अपडेट</p>
          </div>
          <Switch
            checked={emailPreferences.system}
            onCheckedChange={(checked) => onEmailPreferenceChange('system', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>सुरक्षा अलर्ट</Label>
            <p className="text-sm text-gray-500">लॉगिन और सुरक्षा संबंधी जानकारी</p>
          </div>
          <Switch
            checked={emailPreferences.security}
            onCheckedChange={(checked) => onEmailPreferenceChange('security', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreferences;
