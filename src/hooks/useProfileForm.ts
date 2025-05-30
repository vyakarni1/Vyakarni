
import { useState, useCallback } from "react";
import { ProfileFormData, ValidationResult } from "@/types/profile";
import { validateProfileForm } from "@/utils/profileValidation";

interface UseProfileFormOptions {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<boolean>;
}

export const useProfileForm = ({ initialData, onSubmit }: UseProfileFormOptions) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validate = useCallback((): ValidationResult => {
    const validation = validateProfileForm(formData);
    setErrors(validation.errors);
    return validation;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault();
    
    const validation = validate();
    if (!validation.isValid) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        setIsDirty(false);
      }
      return success;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, onSubmit]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    handleSubmit,
    validate,
    reset
  };
};
