
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Shield,
  Bell,
  Key,
  Database,
  Loader2
} from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { settingsMap, isLoading, updateSetting, isUpdating } = useSystemSettings();
  const { toast } = useToast();
  
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local settings when data loads
  useEffect(() => {
    if (Object.keys(settingsMap).length > 0) {
      setLocalSettings(settingsMap);
    }
  }, [settingsMap]);

  // Check for changes
  useEffect(() => {
    const changed = Object.keys(localSettings).some(
      key => localSettings[key] !== settingsMap[key]
    );
    setHasChanges(changed);
  }, [localSettings, settingsMap]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    const changedKeys = Object.keys(localSettings).filter(
      key => localSettings[key] !== settingsMap[key]
    );

    try {
      for (const key of changedKeys) {
        await updateSetting(key, localSettings[key]);
      }
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleReset = () => {
    setLocalSettings(settingsMap);
    setHasChanges(false);
    toast({
      title: "सेटिंग्स रीसेट की गईं",
      description: "सभी परिवर्तन रीसेट कर दिए गए हैं।",
    });
  };

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">सेटिंग्स लोड हो रही हैं...</span>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              सिस्टम सेटिंग्स
            </h1>
            <p className="text-gray-600 mt-1">
              एप्लिकेशन कॉन्फ़िगरेशन और सिस्टम प्राथमिकताएं
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!hasChanges || isUpdating}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>रीसेट</span>
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
              className="flex items-center space-x-2"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>सेव करें</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
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

          {/* Security Settings */}
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

          {/* Notification Settings */}
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

          {/* API & Integration Settings */}
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-purple-600" />
                <span>API और एकीकरण</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>OpenAI API स्थिति</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">कनेक्टेड</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Razorpay पेमेंट स्थिति</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">कॉन्फ़िगर्ड</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Supabase डेटाबेस</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">कनेक्टेड</span>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                API कुंजी पुनर्जनन करें
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-gray-600" />
              <span>सिस्टम जानकारी</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">एप्लिकेशन संस्करण</h4>
                <p className="text-2xl font-bold text-blue-600">v2.1.0</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">डेटाबेस आकार</h4>
                <p className="text-2xl font-bold text-green-600">2.4 GB</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">अंतिम बैकअप</h4>
                <p className="text-2xl font-bold text-purple-600">2 घंटे पहले</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Indicator */}
        {hasChanges && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 shadow-lg">
            <p className="text-sm text-yellow-800">
              आपके पास अनसेव्ड परिवर्तन हैं।
            </p>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
};

export default Settings;
