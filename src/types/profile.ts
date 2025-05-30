
export interface Profile {
  id: string;
  name?: string; // Made optional
  email: string; // Made mandatory
  phone?: string;
  bio?: string;
  avatar_url?: string;
  preferred_language?: 'hindi' | 'english';
  email_preferences?: {
    marketing: boolean;
    system: boolean;
    security: boolean;
  };
  privacy_settings?: {
    profile_visibility: 'private' | 'public';
    activity_status: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
}

export interface PasswordChangeData {
  current: string;
  new: string;
  confirm: string;
}

export interface AvatarUploadState {
  uploading: boolean;
  preview: string | null;
  error: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}
