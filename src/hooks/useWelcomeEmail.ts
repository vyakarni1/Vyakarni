import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWelcomeEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendWelcomeEmail = async (userId: string, userEmail: string, userName: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          userId,
          userEmail, 
          userName: userName || 'व्याकरणी यूज़र'
        }
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
      
      const { data, error } = await supabase.functions.invoke('send-bulk-welcome-emails', {
        body: {}
      });

      if (error) {
        console.error('Error sending bulk welcome emails:', error);
        toast.error('बल्क स्वागत ईमेल भेजने में त्रुटि');
        return false;
      }

      console.log('Bulk welcome emails sent:', data);
      toast.success(`बल्क स्वागत ईमेल भेजे गए: ${data?.successful || 0} सफल, ${data?.failed || 0} असफल`);
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