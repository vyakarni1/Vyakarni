
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';

interface SecuritySettingsProps {
  localSettings: Record<string, any>;
  handleSettingChange: (key: string, value: any) => void;
}

const SecuritySettings = ({ localSettings, handleSettingChange }: SecuritySettingsProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span>सुरक्षा सेटिंग्स</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiRateLimit">API दर सीमा (प्रति मिनट)</Label>
          <Input
            id="apiRateLimit"
            type="number"
            value={localSettings.api_rate_limit || ''}
            onChange={(e) => handleSettingChange('api_rate_limit', parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">सत्र समय सीमा (मिनट)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={localSettings.session_timeout || ''}
            onChange={(e) => handleSettingChange('session_timeout', parseInt(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>नया पंजीकरण सक्षम करें</Label>
            <p className="text-sm text-gray-500">नए उपयोगकर्ता साइन अप कर सकते हैं</p>
          </div>
          <Switch
            checked={localSettings.enable_registration || false}
            onCheckedChange={(checked) => handleSettingChange('enable_registration', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>रखरखाव मोड</Label>
            <p className="text-sm text-gray-500">साइट को रखरखाव मोड में रखें</p>
          </div>
          <Switch
            checked={localSettings.maintenance_mode || false}
            onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
