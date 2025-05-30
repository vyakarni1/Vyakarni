
import { ProfileFormData, PasswordChangeData, ValidationResult, FileValidationResult } from "@/types/profile";

export const validateProfileForm = (data: ProfileFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = "नाम आवश्यक है";
  } else if (data.name.trim().length < 2) {
    errors.name = "नाम कम से कम 2 अक्षर का होना चाहिए";
  }

  if (data.phone && !/^[+]?[\d\s-()]{10,15}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = "कृपया वैध फोन नंबर दर्ज करें";
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = "बायो 500 अक्षरों से अधिक नहीं हो सकता";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePasswordChange = (data: PasswordChangeData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.new) {
    errors.new = "नया पासवर्ड आवश्यक है";
  } else if (data.new.length < 6) {
    errors.new = "पासवर्ड कम से कम 6 अक्षर का होना चाहिए";
  }

  if (!data.confirm) {
    errors.confirm = "पासवर्ड की पुष्टि आवश्यक है";
  } else if (data.new !== data.confirm) {
    errors.confirm = "पासवर्ड मेल नहीं खाते";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateFile = (file: File): FileValidationResult => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    return {
      isValid: false,
      error: "कृपया एक वैध छवि फ़ाइल चुनें"
    };
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return {
      isValid: false,
      error: "फ़ाइल का आकार 2MB से कम होना चाहिए"
    };
  }

  return { isValid: true };
};
