
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSetting {
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  category: string;
  is_public: boolean;
}

interface UseSystemSettingsReturn {
  settings: SystemSetting[];
  settingsMap: Record<string, any>;
  isLoading: boolean;
  error: Error | null;
  updateSetting: (key: string, value: any) => Promise<void>;
  isUpdating: boolean;
}

export const useSystemSettings = (): UseSystemSettingsReturn => {
  const [settingsMap, setSettingsMap] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading, error } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_settings_by_category');
      
      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      return data as SystemSetting[];
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase.rpc('update_system_setting', {
        key_name: key,
        new_value: JSON.stringify(value)
      });

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "सेटिंग अपडेट की गई",
        description: "सिस्टम सेटिंग सफलतापूर्वक अपडेट की गई है।",
      });
    },
    onError: (error: Error) => {
      console.error('Update setting error:', error);
      toast({
        title: "त्रुटि",
        description: "सेटिंग अपडेट करने में त्रुटि हुई।",
        variant: "destructive",
      });
    },
  });

  // Convert settings array to map for easy access
  useEffect(() => {
    if (settings.length > 0) {
      const map = settings.reduce((acc, setting) => {
        try {
          // Parse JSON value, handling different data types
          let value = setting.setting_value;
          if (typeof value === 'string') {
            value = JSON.parse(value);
          }
          acc[setting.setting_key] = value;
        } catch (e) {
          console.warn(`Failed to parse setting ${setting.setting_key}:`, e);
          acc[setting.setting_key] = setting.setting_value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      setSettingsMap(map);
    }
  }, [settings]);

  const updateSetting = async (key: string, value: any) => {
    await updateSettingMutation.mutateAsync({ key, value });
  };

  return {
    settings,
    settingsMap,
    isLoading,
    error,
    updateSetting,
    isUpdating: updateSettingMutation.isPending,
  };
};
