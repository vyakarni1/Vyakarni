
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Bell } from 'lucide-react';

interface NotificationSettingsProps {
  localSettings: Record<string, any>;
  handleSettingChange: (key: string, value: any) => void;
}

const NotificationSettings = ({ localSettings, handleSettingChange }: NotificationSettingsProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-yellow-600" />
          <span>अधिसूचना सेटिंग्स</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>ईमेल अधिसूचनाएं</Label>
            <p className="text-sm text-gray-500">महत्वपूर्ण अपडेट के लिए ईमेल भेजें</p>
          </div>
          <Switch
            checked={localSettings.enable_notifications || false}
            onCheckedChange={(checked) => handleSettingChange('enable_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>स्वचालित बैकअप</Label>
            <p className="text-sm text-gray-500">दैनिक डेटा बैकअप सक्षम करें</p>
          </div>
          <Switch
            checked={localSettings.auto_backup || false}
            onCheckedChange={(checked) => handleSettingChange('auto_backup', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>अधिसूचना आवृत्ति</Label>
          <Select defaultValue="daily">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">तुरंत</SelectItem>
              <SelectItem value="hourly">प्रति घंटे</SelectItem>
              <SelectItem value="daily">दैनिक</SelectItem>
              <SelectItem value="weekly">साप्ताहिक</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
