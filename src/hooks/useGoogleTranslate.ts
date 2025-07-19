
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
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  // Routes to exclude from translation - fix route matching
  const excludedRoutes = ['/grammar-checker'];

  const shouldTranslate = !excludedRoutes.includes(location.pathname);

  useEffect(() => {
    console.log('Current route:', location.pathname);
    console.log('Should translate:', shouldTranslate);
    
    if (!shouldTranslate) return;

    // Load Google Translate script with proper initialization
    const loadGoogleTranslate = () => {
      if (document.getElementById('google-translate-script')) {
        console.log('Google Translate script already loaded');
        return;
      }

      console.log('Loading Google Translate script...');
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
      };

      document.head.appendChild(script);
    };

    // Initialize Google Translate with retry logic
    window.googleTranslateElementInit = () => {
      console.log('Initializing Google Translate...');
      
      const initializeTranslate = (retries = 5) => {
        if (retries <= 0) {
          console.error('Failed to initialize Google Translate after multiple retries');
          return;
        }

        try {
          if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'hi',
              includedLanguages: 'hi,en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            }, 'google_translate_element');
            
            console.log('Google Translate initialized successfully');
            setIsInitialized(true);
          } else {
            console.log(`Google Translate not ready, retrying... (${retries} attempts left)`);
            setTimeout(() => initializeTranslate(retries - 1), 500);
          }
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
          setTimeout(() => initializeTranslate(retries - 1), 500);
        }
      };

      initializeTranslate();
    };

    loadGoogleTranslate();

    return () => {
      // Cleanup on unmount
      const script = document.getElementById('google-translate-script');
      if (script) {
        script.remove();
      }
      setIsInitialized(false);
    };
  }, [shouldTranslate, location.pathname]);

  const toggleTranslation = () => {
    if (!shouldTranslate || !isInitialized) {
      console.log('Translation not available:', { shouldTranslate, isInitialized });
      return;
    }

    console.log('Toggling translation, current state:', isTranslated);
    setIsLoading(true);
    
    const performTranslation = (retries = 10) => {
      if (retries <= 0) {
        console.error('Failed to find translate element after multiple retries');
        setIsLoading(false);
        return;
      }

      try {
        const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        console.log('Translate element found:', !!translateElement);
        
        if (translateElement) {
          const newLanguage = isTranslated ? 'hi' : 'en';
          console.log('Setting language to:', newLanguage);
          
          translateElement.value = newLanguage;
          translateElement.dispatchEvent(new Event('change'));
          
          setIsTranslated(!isTranslated);
          
          // Store preference
          localStorage.setItem('preferred-language', newLanguage);
          
          setTimeout(() => setIsLoading(false), 1500);
        } else {
          console.log(`Translate element not found, retrying... (${retries} attempts left)`);
          setTimeout(() => performTranslation(retries - 1), 200);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTimeout(() => performTranslation(retries - 1), 200);
      }
    };

    performTranslation();
  };

  // Load saved preference on initialization
  useEffect(() => {
    if (isInitialized) {
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage === 'en') {
        setIsTranslated(true);
      }
    }
  }, [isInitialized]);

  return {
    isTranslated,
    isLoading,
    shouldTranslate,
    isInitialized,
    toggleTranslation,
  };
};
