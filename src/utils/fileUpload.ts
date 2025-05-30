
import { supabase } from "@/integrations/supabase/client";

export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const cleanupPreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteAvatar = async (avatarUrl: string, userId: string): Promise<void> => {
  const oldPath = avatarUrl.split('/').pop();
  if (oldPath) {
    await supabase.storage.from('avatars').remove([`${userId}/${oldPath}`]);
  }
};
