
import { useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { AvatarUploadState } from "@/types/profile";
import { validateFile } from "@/utils/profileValidation";
import { createPreviewUrl, cleanupPreviewUrl, uploadAvatar, deleteAvatar } from "@/utils/fileUpload";
import { supabase } from "@/integrations/supabase/client";

interface UseAvatarUploadOptions {
  currentAvatarUrl?: string;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export const useAvatarUpload = ({ currentAvatarUrl, onAvatarUpdate }: UseAvatarUploadOptions) => {
  const { user } = useAuth();
  const [state, setState] = useState<AvatarUploadState>({
    uploading: false,
    preview: null,
    error: null
  });

  const handleFileSelect = useCallback(async (file: File) => {
    if (!user) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      setState(prev => ({ ...prev, error: validation.error || null }));
      toast.error(validation.error);
      return;
    }

    // Create preview
    const previewUrl = createPreviewUrl(file);
    setState(prev => ({ ...prev, preview: previewUrl, error: null }));

    setState(prev => ({ ...prev, uploading: true }));
    try {
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        await deleteAvatar(currentAvatarUrl, user.id);
      }

      // Upload new avatar
      const avatarUrl = await uploadAvatar(file, user.id);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onAvatarUpdate(avatarUrl);
      toast.success("प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई!");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setState(prev => ({ ...prev, error: "फ़ोटो अपलोड करने में त्रुटि" }));
      toast.error("फ़ोटो अपलोड करने में त्रुटि");
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
      if (previewUrl) {
        cleanupPreviewUrl(previewUrl);
        setState(prev => ({ ...prev, preview: null }));
      }
    }
  }, [user, currentAvatarUrl, onAvatarUpdate]);

  const removeAvatar = useCallback(async () => {
    if (!user || !currentAvatarUrl) return;

    setState(prev => ({ ...prev, uploading: true }));
    try {
      await deleteAvatar(currentAvatarUrl, user.id);

      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      onAvatarUpdate('');
      toast.success("प्रोफ़ाइल फ़ोटो हटा दी गई");
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error("फ़ोटो हटाने में त्रुटि");
    } finally {
      setState(prev => ({ ...prev, uploading: false }));
    }
  }, [user, currentAvatarUrl, onAvatarUpdate]);

  return {
    ...state,
    handleFileSelect,
    removeAvatar
  };
};
