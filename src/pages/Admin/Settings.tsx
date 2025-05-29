
import ModernAdminLayout from '@/components/Admin/ModernAdminLayout';
import { Loader2 } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SettingsHeader from '@/components/Admin/Settings/SettingsHeader';
import GeneralSettings from '@/components/Admin/Settings/GeneralSettings';
import SecuritySettings from '@/components/Admin/Settings/SecuritySettings';
import NotificationSettings from '@/components/Admin/Settings/NotificationSettings';
import ApiIntegrationSettings from '@/components/Admin/Settings/ApiIntegrationSettings';
import SystemInformation from '@/components/Admin/Settings/SystemInformation';

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
        <SettingsHeader
          hasChanges={hasChanges}
          isUpdating={isUpdating}
          onSave={handleSave}
          onReset={handleReset}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GeneralSettings 
            localSettings={localSettings}
            handleSettingChange={handleSettingChange}
          />
          <SecuritySettings 
            localSettings={localSettings}
            handleSettingChange={handleSettingChange}
          />
          <NotificationSettings 
            localSettings={localSettings}
            handleSettingChange={handleSettingChange}
          />
          <ApiIntegrationSettings />
        </div>

        <SystemInformation />

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
