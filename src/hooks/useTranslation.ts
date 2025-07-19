
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useTranslation = () => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const location = useLocation();

  // Routes to exclude from translation
  const excludedRoutes = ['/grammar-checker'];
  const shouldTranslate = !excludedRoutes.includes(location.pathname);

  // Load saved preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage === 'en') {
      setIsTranslated(true);
      // Apply translation to current page
      translatePageContent('en');
    }
  }, []);

  const translatePageContent = async (targetLanguage: 'hi' | 'en') => {
    if (!shouldTranslate) return;

    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    for (const element of elementsToTranslate) {
      const originalText = element.getAttribute('data-original') || element.textContent;
      
      if (originalText) {
        // Store original text if not already stored
        if (!element.getAttribute('data-original')) {
          element.setAttribute('data-original', originalText);
        }

        try {
          const { data, error } = await supabase.functions.invoke('translate-text', {
            body: {
              text: originalText,
              targetLanguage,
              sourceLanguage: targetLanguage === 'en' ? 'hi' : 'en'
            }
          });

          if (error) {
            console.error('Translation error:', error);
            continue;
          }

          if (data?.translatedText) {
            element.textContent = data.translatedText;
          }
        } catch (error) {
          console.error('Translation request failed:', error);
        }
      }
    }
  };

  const toggleTranslation = async () => {
    if (!shouldTranslate || isLoading) return;

    console.log('Toggling translation, current state:', isTranslated);
    setIsLoading(true);
    
    try {
      const newLanguage = isTranslated ? 'hi' : 'en';
      
      await translatePageContent(newLanguage);
      
      setIsTranslated(!isTranslated);
      localStorage.setItem('preferred-language', newLanguage);
      
      console.log('Translation completed, new language:', newLanguage);
    } catch (error) {
      console.error('Translation toggle failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isTranslated,
    isLoading,
    shouldTranslate,
    isInitialized,
    toggleTranslation,
  };
};
