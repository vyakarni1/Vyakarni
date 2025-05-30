
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Type the data properly to match our Profile interface
      const profileData: Profile = {
        ...data,
        preferred_language: data.preferred_language as 'hindi' | 'english' || 'hindi',
        email_preferences: data.email_preferences as Profile['email_preferences'],
        privacy_settings: data.privacy_settings as Profile['privacy_settings']
      };
      
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError("प्रोफाइल लोड करने में त्रुटि");
      toast.error("प्रोफाइल लोड करने में त्रुटि");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateProfile = useCallback(async (updates: Partial<Profile>): Promise<boolean> => {
    if (!userId || !profile) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Type the response data properly
      const profileData: Profile = {
        ...data,
        preferred_language: data.preferred_language as 'hindi' | 'english' || 'hindi',
        email_preferences: data.email_preferences as Profile['email_preferences'],
        privacy_settings: data.privacy_settings as Profile['privacy_settings']
      };

      setProfile(profileData);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error("प्रोफाइल अपडेट करने में त्रुटि");
      return false;
    }
  }, [userId, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
