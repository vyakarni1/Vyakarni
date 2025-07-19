
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
      // Apply translation to current page after a short delay
      setTimeout(() => translatePageContent('en'), 100);
    }
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
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent?.trim())
          .join('').trim();
        return directText.length > 0;
      }
      
      return true;
    });
  };

  const translatePageContent = async (targetLanguage: 'hi' | 'en') => {
    if (!shouldTranslate) return;

    setIsLoading(true);
    
    try {
      const elementsToTranslate = getTranslatableElements();
      console.log(`Found ${elementsToTranslate.length} elements to translate`);
      
      // Group elements into batches for better performance
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
        batches.push(elementsToTranslate.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        await Promise.all(batch.map(async (element) => {
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

            try {
              const { data, error } = await supabase.functions.invoke('translate-text', {
                body: {
                  text: originalText.trim(),
                  targetLanguage,
                  sourceLanguage: targetLanguage === 'en' ? 'hi' : 'en'
                }
              });

              if (error) {
                console.error('Translation error:', error);
                return;
              }

              if (data?.translatedText) {
                // Double-check element is still in DOM before modifying
                if (!document.contains(element)) {
                  return;
                }

                try {
                  // Handle elements with mixed content more safely
                  if (element.children.length > 0) {
                    // Find and replace only direct text nodes
                    const walker = document.createTreeWalker(
                      element,
                      NodeFilter.SHOW_TEXT,
                      {
                        acceptNode: (node) => {
                          // Only accept direct child text nodes
                          return node.parentNode === element ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                        }
                      }
                    );

                    const textNodes = [];
                    let node;
                    while (node = walker.nextNode()) {
                      if (node.textContent?.trim()) {
                        textNodes.push(node);
                      }
                    }

                    textNodes.forEach(textNode => {
                      if (document.contains(textNode)) {
                        textNode.textContent = data.translatedText;
                      }
                    });
                  } else {
                    element.textContent = data.translatedText;
                  }
                } catch (domError) {
                  console.warn('DOM modification failed:', domError);
                }
              }
            } catch (error) {
              console.error('Translation request failed:', error);
            }
          }
        }));
        
        // Small delay between batches to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
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
