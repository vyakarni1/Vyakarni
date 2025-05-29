
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon } from 'lucide-react';

interface GeneralSettingsProps {
  localSettings: Record<string, any>;
  handleSettingChange: (key: string, value: any) => void;
}

const GeneralSettings = ({ localSettings, handleSettingChange }: GeneralSettingsProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5 text-blue-600" />
          <span>सामान्य सेटिंग्स</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">साइट का नाम</Label>
          <Input
            id="siteName"
            value={localSettings.site_name || ''}
            onChange={(e) => handleSettingChange('site_name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">साइट विवरण</Label>
          <Textarea
            id="siteDescription"
            value={localSettings.site_description || ''}
            onChange={(e) => handleSettingChange('site_description', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminEmail">व्यवस्थापक ईमेल</Label>
          <Input
            id="adminEmail"
            type="email"
            value={localSettings.admin_email || ''}
            onChange={(e) => handleSettingChange('admin_email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxFileSize">अधिकतम फ़ाइल साइज़ (MB)</Label>
          <Input
            id="maxFileSize"
            type="number"
            value={localSettings.max_file_size || ''}
            onChange={(e) => handleSettingChange('max_file_size', parseInt(e.target.value))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
