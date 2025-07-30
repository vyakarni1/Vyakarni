import { useState, useEffect } from "react";
import AdminLayoutWithNavigation from "@/components/AdminLayoutWithNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RefreshCw, Users, Mail, Database, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  category: string;
  is_public: boolean;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSettings, setEditingSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('सेटिंग्स लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (settingKey: string, value: any) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingKey]: value
    }));
  };

  const saveSetting = async (setting: SystemSetting) => {
    setSaving(true);
    try {
      const newValue = editingSettings[setting.setting_key] ?? setting.setting_value;
      
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: newValue })
        .eq('id', setting.id);

      if (error) throw error;

      // Update local state
      setSettings(prev => prev.map(s => 
        s.id === setting.id 
          ? { ...s, setting_value: newValue }
          : s
      ));
      
      // Clear editing state
      setEditingSettings(prev => {
        const newState = { ...prev };
        delete newState[setting.setting_key];
        return newState;
      });

      toast.success('सेटिंग सहेजी गई');
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('सेटिंग सहेजने में त्रुटि');
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    const currentValue = editingSettings[setting.setting_key] ?? setting.setting_value;
    
    switch (setting.setting_type) {
      case 'boolean':
        return (
          <Switch
            checked={currentValue}
            onCheckedChange={(checked) => handleSettingChange(setting.setting_key, checked)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.setting_key, Number(e.target.value))}
            className="max-w-xs"
          />
        );
      case 'text':
        return (
          <Textarea
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            rows={3}
          />
        );
      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
          />
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return Settings;
      case 'users': return Users;
      case 'email': return Mail;
      case 'database': return Database;
      case 'security': return Shield;
      default: return Settings;
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  if (loading) {
    return (
      <AdminLayoutWithNavigation>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">सेटिंग्स लोड हो रही हैं...</p>
          </div>
        </div>
      </AdminLayoutWithNavigation>
    );
  }

  return (
    <AdminLayoutWithNavigation>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">सिस्टम सेटिंग्स</h1>
            <p className="text-muted-foreground mt-2">एप्लिकेशन कॉन्फ़िगरेशन और सेटिंग्स का प्रबंधन</p>
          </div>
          <Button onClick={fetchSettings} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            रिफ्रेश करें
          </Button>
        </div>

        {/* Settings Categories */}
        {Object.entries(groupedSettings).map(([category, categorySettings]) => {
          const IconComponent = getCategoryIcon(category);
          
          return (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5" />
                  <span className="capitalize">
                    {category === 'general' && 'सामान्य'}
                    {category === 'users' && 'उपयोगकर्ता'}
                    {category === 'email' && 'ईमेल'}
                    {category === 'database' && 'डेटाबेस'}
                    {category === 'security' && 'सुरक्षा'}
                    {!['general', 'users', 'email', 'database', 'security'].includes(category) && category}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categorySettings.map((setting) => {
                    const hasChanges = setting.setting_key in editingSettings;
                    
                    return (
                      <div key={setting.id} className="border-b border-border pb-4 last:border-b-0">
                        <div className="flex items-start justify-between space-x-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-foreground">{setting.setting_key}</h4>
                              {setting.is_public && (
                                <Badge variant="secondary" className="text-xs">
                                  सार्वजनिक
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {setting.setting_type}
                              </Badge>
                            </div>
                            {setting.description && (
                              <p className="text-sm text-muted-foreground">
                                {setting.description}
                              </p>
                            )}
                            <div className="max-w-md">
                              {renderSettingInput(setting)}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {hasChanges && (
                              <Button
                                size="sm"
                                onClick={() => saveSetting(setting)}
                                disabled={saving}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                सहेजें
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {settings.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">कोई सिस्टम सेटिंग्स नहीं मिलीं</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayoutWithNavigation>
  );
};

export default AdminSettings;