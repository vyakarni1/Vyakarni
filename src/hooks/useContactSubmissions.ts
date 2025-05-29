
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { ContactSubmission } from '@/types/contact';

export const useContactSubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('संदेश लोड करने में त्रुटि');
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error in fetchSubmissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          handled_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating submission:', error);
        toast.error('स्थिति अपडेट करने में त्रुटि');
        return;
      }

      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === id
            ? { ...sub, status, handled_by: user?.id, updated_at: new Date().toISOString() }
            : sub
        )
      );

      toast.success('स्थिति सफलतापूर्वक अपडेट की गई');
    } catch (error) {
      console.error('Error in updateSubmissionStatus:', error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    updateSubmissionStatus,
    refetch: fetchSubmissions,
  };
};
