
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  text: string;
  targetLanguage: 'hi' | 'en';
  sourceLanguage?: 'hi' | 'en';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage, sourceLanguage = 'auto' }: TranslateRequest = await req.json();
    
    console.log('Translation request:', { text: text.substring(0, 50), targetLanguage, sourceLanguage });

    // For now, we'll implement a simple fallback translation
    // In production, you would use Google Cloud Translation API here
    const translatedText = await translateText(text, targetLanguage, sourceLanguage);

    return new Response(JSON.stringify({ 
      translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'hi' : sourceLanguage,
      targetLanguage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Translation failed',
      translatedText: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function translateText(text: string, targetLang: string, sourceLang: string): Promise<string> {
  // Simple dictionary-based translation for key UI elements
  const translations: Record<string, Record<string, string>> = {
    'hi': {
      'Dashboard': 'डैशबोर्ड',
      'Grammar Check': 'व्याकरण जाँच',
      'Profile': 'प्रोफाइल',
      'Pricing': 'प्राइसिंग',
      'About Us': 'हमारे बारे में',
      'Contact': 'संपर्क',
      'Login': 'लॉगिन',
      'Register': 'रजिस्टर करें',
      'Logout': 'लॉग आउट',
      'Welcome': 'स्वागत है',
      'Home': 'होम',
      'Settings': 'सेटिंग्स',
      'Help': 'सहायता',
      'Search': 'खोजें',
      'Save': 'सेव करें',
      'Cancel': 'रद्द करें',
      'Submit': 'जमा करें',
      'Edit': 'संपादित करें',
      'Delete': 'हटाएं',
      'Loading...': 'लोड हो रहा...',
      'English': 'अंग्रेजी',
      'Hindi': 'हिंदी'
    },
    'en': {
      'डैशबोर्ड': 'Dashboard',
      'व्याकरण जाँच': 'Grammar Check',
      'प्रोफाइल': 'Profile',
      'प्राइसिंग': 'Pricing',
      'हमारे बारे में': 'About Us',
      'संपर्क': 'Contact',
      'लॉगिन': 'Login',
      'रजिस्टर करें': 'Register',
      'लॉग आउट': 'Logout',
      'स्वागत है': 'Welcome',
      'होम': 'Home',
      'सेटिंग्स': 'Settings',
      'सहायता': 'Help',
      'खोजें': 'Search',
      'सेव करें': 'Save',
      'रद्द करें': 'Cancel',
      'जमा करें': 'Submit',
      'संपादित करें': 'Edit',
      'हटाएं': 'Delete',
      'लोड हो रहा...': 'Loading...',
      'अंग्रेजी': 'English',
      'हिंदी': 'Hindi'
    }
  };

  // Check if we have a direct translation
  if (translations[targetLang] && translations[targetLang][text]) {
    return translations[targetLang][text];
  }

  // For longer text, split by common delimiters and translate parts
  const words = text.split(/(\s+|[,।.!?;:])/);
  const translatedWords = words.map(word => {
    const trimmedWord = word.trim();
    if (translations[targetLang] && translations[targetLang][trimmedWord]) {
      return translations[targetLang][trimmedWord];
    }
    return word;
  });

  return translatedWords.join('');
}
