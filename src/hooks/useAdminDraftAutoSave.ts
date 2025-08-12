import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface DraftData {
  [key: string]: any;
}

interface UseAdminDraftAutoSaveOptions {
  draftKey: string;
  draftType: string;
  autoSaveDelay?: number; // milliseconds
}

export const useAdminDraftAutoSave = (options: UseAdminDraftAutoSaveOptions) => {
  const { draftKey, draftType, autoSaveDelay = 2000 } = options;
  const { user } = useAuth();
  const [draftData, setDraftData] = useState<DraftData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load draft data on component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('admin_drafts')
          .select('form_data, updated_at')
          .eq('admin_id', user.id)
          .eq('draft_key', draftKey)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading draft:', error);
          return;
        }

        if (data) {
          setDraftData((data.form_data as DraftData) || {});
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [user?.id, draftKey]);

  // Auto-save function
  const saveDraft = useCallback(async (data: DraftData, silent = false) => {
    if (!user?.id) return false;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('admin_drafts')
        .upsert({
          admin_id: user.id,
          draft_key: draftKey,
          draft_type: draftType,
          form_data: data
        }, {
          onConflict: 'admin_id,draft_key'
        });

      if (error) {
        console.error('Error saving draft:', error);
        if (!silent) {
          toast.error('ड्राफ्ट सेव करने में त्रुटि');
        }
        return false;
      }

      setLastSaved(new Date());
      if (!silent) {
        toast.success('ड्राफ्ट सेव किया गया', { duration: 2000 });
      }
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      if (!silent) {
        toast.error('ड्राफ्ट सेव करने में त्रुटि');
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user?.id, draftKey, draftType]);

  // Update draft data and trigger auto-save
  const updateDraft = useCallback((updates: Partial<DraftData>) => {
    const newData = { ...draftData, ...updates };
    setDraftData(newData);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(newData, true); // Silent save for auto-save
    }, autoSaveDelay);
  }, [draftData, saveDraft, autoSaveDelay]);

  // Manual save function
  const manualSave = useCallback(() => {
    return saveDraft(draftData, false);
  }, [draftData, saveDraft]);

  // Clear draft function
  const clearDraft = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('admin_drafts')
        .delete()
        .eq('admin_id', user.id)
        .eq('draft_key', draftKey);

      setDraftData({});
      setLastSaved(null);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [user?.id, draftKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    draftData,
    updateDraft,
    manualSave,
    clearDraft,
    isLoading,
    isSaving,
    lastSaved
  };
};