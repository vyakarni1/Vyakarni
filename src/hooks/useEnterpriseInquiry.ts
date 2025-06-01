
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnterpriseFormData } from '@/types/enterprise';

export const useEnterpriseInquiry = () => {
  const [loading, setLoading] = useState(false);

  const submitInquiry = async (formData: EnterpriseFormData) => {
    setLoading(true);
    
    try {
      const inquiryData = {
        company_name: formData.company_name,
        contact_person: formData.contact_person,
        email: formData.email,
        phone: formData.phone || null,
        company_size: formData.company_size,
        industry: formData.industry || null,
        requirements: formData.requirements || null,
        estimated_users: formData.estimated_users ? parseInt(formData.estimated_users) : null,
        message: formData.message || null,
      };

      const { error } = await supabase
        .from('enterprise_inquiries')
        .insert([inquiryData]);

      if (error) throw error;

      toast.success('एंटरप्राइज़ संपर्क फॉर्म सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।');
      return true;
    } catch (error) {
      console.error('Error submitting enterprise inquiry:', error);
      toast.error('फॉर्म भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitInquiry, loading };
};
