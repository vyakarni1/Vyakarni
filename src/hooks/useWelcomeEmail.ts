import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWelcomeEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendWelcomeEmail = async (userId: string, userEmail: string, userName: string) => {
    try {
      setLoading(true);
      
      // Use the new safe database function
      const { data, error } = await supabase.rpc('send_welcome_email_safe', {
        user_uuid: userId,
        user_email: userEmail,
        user_name: userName || 'व्याकरणी यूज़र'
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        toast.error('स्वागत ईमेल भेजने में त्रुटि');
        return false;
      }

      console.log('Welcome email sent successfully:', data);
      toast.success('स्वागत ईमेल सफलतापूर्वक भेजा गया');
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast.error('स्वागत ईमेल भेजने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendBulkWelcomeEmails = async () => {
    try {
      setLoading(true);
      
      // Use the new safe database function
      const { data, error } = await supabase.rpc('send_bulk_welcome_emails_safe');

      if (error) {
        console.error('Error sending bulk welcome emails:', error);
        toast.error('बल्क स्वागत ईमेल भेजने में त्रुटि');
        return false;
      }

      console.log('Bulk welcome emails sent:', data);
      const result = data as { successful?: number; failed?: number; total_processed?: number } | null;
      toast.success(`बल्क स्वागत ईमेल भेजे गए: ${result?.successful || 0} सफल, ${result?.failed || 0} असफल`);
      return true;
    } catch (error) {
      console.error('Error sending bulk welcome emails:', error);
      toast.error('बल्क स्वागत ईमेल भेजने में त्रुटि');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendWelcomeEmail,
    sendBulkWelcomeEmails,
    loading
  };
};