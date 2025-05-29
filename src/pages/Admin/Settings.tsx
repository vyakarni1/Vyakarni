
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
  Mail,
  Database,
  Key
} from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'हिंदी व्याकरण चेकर',
    siteDescription: 'उन्नत हिंदी व्याकरण और शैली सुधार उपकरण',
    adminEmail: 'admin@grammarcheck.com',
    maxFileSize: '10',
    enableRegistration: true,
    enableNotifications: true,
    autoBackup: true,
    maintenanceMode: false,
    apiRateLimit: '100',
    sessionTimeout: '30'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings);
  };

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
            <Button variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>रीसेट</span>
            </Button>
            <Button onClick={handleSave} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
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
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">साइट विवरण</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">व्यवस्थापक ईमेल</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize">अधिकतम फ़ाइल साइज़ (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
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
                  value={settings.apiRateLimit}
                  onChange={(e) => handleSettingChange('apiRateLimit', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">सत्र समय सीमा (मिनट)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>नया पंजीकरण सक्षम करें</Label>
                  <p className="text-sm text-gray-500">नए उपयोगकर्ता साइन अप कर सकते हैं</p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => handleSettingChange('enableRegistration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>रखरखाव मोड</Label>
                  <p className="text-sm text-gray-500">साइट को रखरखाव मोड में रखें</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
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
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => handleSettingChange('enableNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>स्वचालित बैकअप</Label>
                  <p className="text-sm text-gray-500">दैनिक डेटा बैकअप सक्षम करें</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
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
      </div>
    </ModernAdminLayout>
  );
};

export default Settings;
