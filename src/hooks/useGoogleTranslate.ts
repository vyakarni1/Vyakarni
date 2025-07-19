
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const useGoogleTranslate = () => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Routes to exclude from translation
  const excludedRoutes = ['/grammar-checker', '/index'];

  const shouldTranslate = !excludedRoutes.includes(location.pathname);

  useEffect(() => {
    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'hi',
          includedLanguages: 'hi,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element');
      }
    };

    return () => {
      // Cleanup script if needed
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const toggleTranslation = () => {
    if (!shouldTranslate) return;

    setIsLoading(true);
    
    try {
      const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (translateElement) {
        if (isTranslated) {
          translateElement.value = 'hi';
          setIsTranslated(false);
        } else {
          translateElement.value = 'en';
          setIsTranslated(true);
        }
        translateElement.dispatchEvent(new Event('change'));
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return {
    isTranslated,
    isLoading,
    shouldTranslate,
    toggleTranslation,
  };
};
