
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PasswordChangeData } from "@/types/profile";
import { validatePasswordChange } from "@/utils/profileValidation";

export const usePasswordChange = () => {
  const [passwords, setPasswords] = useState<PasswordChangeData>({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const updatePassword = useCallback((field: keyof PasswordChangeData, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const togglePasswordVisibility = useCallback((field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const changePassword = useCallback(async (): Promise<boolean> => {
    const validation = validatePasswordChange(passwords);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      return false;
    }

    setIsLoading(true);
    try {
      console.log('Updating user password...');
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) {
        console.error('Password change error:', error);
        throw error;
      }

      console.log('Password changed successfully');
      toast.success("पासवर्ड सफलतापूर्वक बदल दिया गया!");
      setPasswords({ current: '', new: '', confirm: '' });
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error);
      
      // Handle specific error cases
      if (error.message?.includes('session_not_found')) {
        toast.error("सत्र समाप्त हो गया। कृपया पुनः लॉगिन करें।");
      } else if (error.message?.includes('invalid_credentials')) {
        toast.error("अमान्य पासवर्ड");
      } else {
        toast.error(error.message || "पासवर्ड बदलने में त्रुटि");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [passwords]);

  const reset = useCallback(() => {
    setPasswords({ current: '', new: '', confirm: '' });
    setErrors({});
    setShowPasswords({ current: false, new: false, confirm: false });
  }, []);

  return {
    passwords,
    showPasswords,
    errors,
    isLoading,
    updatePassword,
    togglePasswordVisibility,
    changePassword,
    reset
  };
};
