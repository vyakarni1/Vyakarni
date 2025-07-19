
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TranslationCache {
  [key: string]: string;
}

export const useTranslation = () => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const location = useLocation();

  // Routes to exclude from translation
  const excludedRoutes = ['/grammar-checker'];
  const shouldTranslate = !excludedRoutes.includes(location.pathname);

  // Load saved preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage === 'en') {
      setIsTranslated(true);
      // Apply translation to current page after a short delay
      setTimeout(() => translatePageContent('en'), 100);
    }
  }, [location.pathname]);

  // Clear cache when route changes
  useEffect(() => {
    setTranslationCache({});
  }, [location.pathname]);

  // Selectors for elements to translate (excluding inputs, code, etc.)
  const getTranslatableElements = () => {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',           // Headings
      'p',                                 // Paragraphs
      'span:not([class*="lucide"])',      // Spans (excluding icons)
      'button',                           // Buttons
      'a',                                // Links
      'label',                            // Labels
      'div[data-translate]',              // Explicitly marked divs
      '[data-translate]'                  // Any element with data-translate
    ].join(', ');

    const elements = document.querySelectorAll(selectors);
    
    // Filter out elements that shouldn't be translated
    return Array.from(elements).filter(element => {
      // Skip if empty or only whitespace
      const text = element.textContent?.trim();
      if (!text) return false;
      
      // Skip if contains only numbers or special characters
      if (/^[\d\s\-\+\(\)\[\]\{\}\.\,\!\?\:\;]+$/.test(text)) return false;
      
      // Skip if it's an input or textarea
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return false;
      
      // Skip if it's inside a code block or pre tag
      if (element.closest('code, pre, .code')) return false;
      
      // Skip if it contains other elements (composite elements)
      const hasChildElements = element.children.length > 0;
      if (hasChildElements && !element.hasAttribute('data-translate')) {
        // Only translate if it has direct text content
        const directText = Array.from(element.childNodes)
          .filter((node): node is ChildNode => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .join('').trim();
        return directText.length > 0;
      }
      
      return true;
    });
  };

  const translateText = async (text: string, targetLanguage: 'hi' | 'en'): Promise<string> => {
    const cacheKey = `${text}_${targetLanguage}`;
    
    // Return cached translation if available
    if (translationCache[cacheKey]) {
      return translationCache[cacheKey];
    }

    try {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: {
          text: text.trim(),
          targetLanguage,
          sourceLanguage: targetLanguage === 'en' ? 'hi' : 'en'
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return text;
      }

      const translatedText = data?.translatedText || text;
      
      // Cache the translation
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedText
      }));
      
      return translatedText;
    } catch (error) {
      console.error('Translation request failed:', error);
      return text;
    }
  };

  const translatePageContent = async (targetLanguage: 'hi' | 'en') => {
    if (!shouldTranslate) return;

    setIsLoading(true);
    
    try {
      const elementsToTranslate = getTranslatableElements();
      console.log(`Found ${elementsToTranslate.length} elements to translate`);
      
      // Process elements in smaller batches to avoid overwhelming the API
      const batchSize = 3;
      const batches = [];
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        batches.push(elementsToTranslate.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        const promises = batch.map(async (element) => {
          // Skip if element is no longer in the DOM
          if (!document.contains(element)) {
            return;
          }

          const originalText = element.getAttribute('data-original') || element.textContent;
          
          if (originalText && originalText.trim()) {
            // Store original text if not already stored
            if (!element.getAttribute('data-original')) {
              try {
                element.setAttribute('data-original', originalText);
              } catch (error) {
                console.warn('Could not set data-original attribute:', error);
                return;
              }
            }

            const translatedText = await translateText(originalText, targetLanguage);
            
            // Use a much safer approach that avoids replaceChild
            if (document.contains(element) && translatedText !== originalText) {
              try {
                // Only update text content for simple elements
                if (element.children.length === 0) {
                  element.textContent = translatedText;
                } else {
                  // For complex elements, use a data attribute approach
                  element.setAttribute('data-translated-text', translatedText);
                  
                  // Use CSS to show translated text (safer than DOM manipulation)
                  if (!document.querySelector('#translation-styles')) {
                    const styleSheet = document.createElement('style');
                    styleSheet.id = 'translation-styles';
                    styleSheet.textContent = `
                      [data-translated-text]:not([data-translate]) {
                        position: relative;
                      }
                      [data-translated-text]:not([data-translate])::before {
                        content: attr(data-translated-text);
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: inherit;
                        color: inherit;
                        font: inherit;
                        z-index: 1;
                        pointer-events: none;
                      }
                      [data-translated-text]:not([data-translate]) * {
                        visibility: hidden;
                      }
                    `;
                    document.head.appendChild(styleSheet);
                  }
                }
              } catch (domError) {
                console.warn('Safe text update failed:', domError);
              }
            }
          }
        });

        await Promise.all(promises);
        
        // Longer delay between batches to ensure stability
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Translation process failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = async () => {
    if (!shouldTranslate || isLoading) return;

    console.log('Toggling translation, current state:', isTranslated);
    
    const newLanguage = isTranslated ? 'hi' : 'en';
    
    // Clean up any existing translation styles
    const existingStyles = document.querySelector('#translation-styles');
    if (existingStyles && newLanguage === 'hi') {
      existingStyles.remove();
      // Restore original text for complex elements
      document.querySelectorAll('[data-translated-text]').forEach(element => {
        element.removeAttribute('data-translated-text');
      });
    }
    
    await translatePageContent(newLanguage);
    
    setIsTranslated(!isTranslated);
    localStorage.setItem('preferred-language', newLanguage);
    
    console.log('Translation completed, new language:', newLanguage);
  };

  return {
    isTranslated,
    isLoading,
    shouldTranslate,
    isInitialized,
    toggleTranslation,
  };
};
