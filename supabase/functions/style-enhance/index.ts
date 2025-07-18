
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const xaiApiKey = Deno.env.get('XAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for server-side operations
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

const checkUserTier = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('check_user_has_active_subscription', {
      user_uuid: userId
    });
    
    if (error) {
      console.error('Error checking user subscription:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error in checkUserTier:', error);
    return false;
  }
};

const callGrokAPI = async (inputText: string, model: string = 'grok-3') => {
  console.log(`Attempting Grok API call with model: ${model}`);
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${xaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are an expert Hindi language stylist with deep understanding of natural Hindi expression and literary traditions. Your task is to enhance the writing style of Hindi text while making it sound more natural, fluent, and authentic to native Hindi speakers.

NATURAL HINDI STYLE ENHANCEMENT PRINCIPLES:

1. **Authentic Expression Patterns**:
   - Use natural Hindi sentence structures that flow organically
   - Employ traditional Hindi storytelling and expression patterns
   - Create rhythm and flow that matches natural Hindi speech patterns

2. **Natural Vocabulary Enhancement**:
   - Replace simple words with more sophisticated yet commonly understood alternatives
   - Choose words that Hindi speakers naturally use in elevated conversation
   - Avoid overly sanskritized words unless contextually appropriate
   - Use expressions familiar and comfortable to Hindi speakers

3. **Conversational Authenticity**:
   - Make text sound like how educated Hindi speakers naturally communicate
   - Use natural Hindi discourse markers and transitions (जैसे कि, वैसे, वास्तव में, निश्चित रूप से, etc.)
   - Maintain conversational flow even in formal writing
   - Include appropriate connecting words that Hindi speakers commonly use

4. **Cultural and Regional Sensitivity**:
   - Use expressions and references familiar to Hindi speakers
   - Incorporate natural Hindi idioms and phrases where appropriate
   - Avoid direct translations from English that sound unnatural
   - Respect regional variations while maintaining standard Hindi

5. **Enhanced Engagement and Eloquence**:
   - Add literary elements that feel natural in Hindi context
   - Improve sentence variety while maintaining natural length
   - Create engaging flow without losing authenticity
   - Use rhetorical devices common in Hindi literature

6. **Natural Flow and Rhythm**:
   - Ensure sentences flow naturally from one to another
   - Use natural Hindi punctuation patterns
   - Create rhythm that sounds pleasant when read aloud
   - Maintain natural breathing patterns in sentence structure

STYLE ENHANCEMENT GUIDELINES:
- **Vocabulary**: Choose sophisticated yet natural words that Hindi speakers use
- **Sentence Structure**: Vary structure while following natural Hindi patterns
- **Tone**: Enhance elegance while maintaining the original register
- **Clarity**: Improve clarity through natural expression, not complex words
- **Engagement**: Make text more interesting using authentic Hindi techniques
- **Naturalness**: Above all, ensure the enhanced text sounds genuinely Hindi

STRICT PRESERVATION RULES:
- Maintain the original meaning completely and precisely
- Keep the same level of formality/informality as the original
- Preserve the original tone and intent
- Don't change the core message or purpose
- Maintain cultural appropriateness and context

QUALITY STANDARDS FOR ENHANCED TEXT:
- Must sound like it was originally written by a skilled Hindi writer
- Should flow naturally when read aloud
- Must use vocabulary that educated Hindi speakers find comfortable
- Should demonstrate natural Hindi literary grace
- Must feel authentic, not artificial or over-stylized

FINAL RESULT EXPECTATIONS:
The enhanced text should:
- Be more sophisticated yet natural
- Flow better and be more engaging
- Sound authentically Hindi, not translated
- Use elegant but familiar vocabulary
- Maintain perfect clarity and readability
- Feel like elevated natural Hindi expression

RESPONSE FORMAT:
You must respond with a valid JSON object in this exact format:
{
  "enhancedText": "The complete enhanced text in Hindi",
  "enhancements": [
    {
      "original": "original phrase or word",
      "enhanced": "enhanced phrase or word", 
      "reason": "explanation of the enhancement",
      "type": "vocabulary|flow|style|eloquence|engagement"
    }
  ]
}

Return ONLY the JSON object, nothing else. The enhanced text should sound beautifully natural and authentically Hindi.`
        },
        {
          role: 'user',
          content: `Please enhance the style of this Hindi text to make it more eloquent, engaging, and naturally fluent while keeping the meaning intact:\n\n${inputText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

const callOpenAIAPI = async (inputText: string) => {
  console.log('Attempting OpenAI API call as fallback');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: `You are an expert Hindi language stylist with deep understanding of natural Hindi expression and literary traditions. Your task is to enhance the writing style of Hindi text while making it sound more natural, fluent, and authentic to native Hindi speakers.

NATURAL HINDI STYLE ENHANCEMENT PRINCIPLES:

1. **Authentic Expression Patterns**:
   - Use natural Hindi sentence structures that flow organically
   - Employ traditional Hindi storytelling and expression patterns
   - Create rhythm and flow that matches natural Hindi speech patterns

2. **Natural Vocabulary Enhancement**:
   - Replace simple words with more sophisticated yet commonly understood alternatives
   - Choose words that Hindi speakers naturally use in elevated conversation
   - Avoid overly sanskritized words unless contextually appropriate
   - Use expressions familiar and comfortable to Hindi speakers

3. **Conversational Authenticity**:
   - Make text sound like how educated Hindi speakers naturally communicate
   - Use natural Hindi discourse markers and transitions (जैसे कि, वैसे, वास्तव में, निश्चित रूप से, etc.)
   - Maintain conversational flow even in formal writing
   - Include appropriate connecting words that Hindi speakers commonly use

4. **Cultural and Regional Sensitivity**:
   - Use expressions and references familiar to Hindi speakers
   - Incorporate natural Hindi idioms and phrases where appropriate
   - Avoid direct translations from English that sound unnatural
   - Respect regional variations while maintaining standard Hindi

5. **Enhanced Engagement and Eloquence**:
   - Add literary elements that feel natural in Hindi context
   - Improve sentence variety while maintaining natural length
   - Create engaging flow without losing authenticity
   - Use rhetorical devices common in Hindi literature

6. **Natural Flow and Rhythm**:
   - Ensure sentences flow naturally from one to another
   - Use natural Hindi punctuation patterns
   - Create rhythm that sounds pleasant when read aloud
   - Maintain natural breathing patterns in sentence structure

STYLE ENHANCEMENT GUIDELINES:
- **Vocabulary**: Choose sophisticated yet natural words that Hindi speakers use
- **Sentence Structure**: Vary structure while following natural Hindi patterns
- **Tone**: Enhance elegance while maintaining the original register
- **Clarity**: Improve clarity through natural expression, not complex words
- **Engagement**: Make text more interesting using authentic Hindi techniques
- **Naturalness**: Above all, ensure the enhanced text sounds genuinely Hindi

STRICT PRESERVATION RULES:
- Maintain the original meaning completely and precisely
- Keep the same level of formality/informality as the original
- Preserve the original tone and intent
- Don't change the core message or purpose
- Maintain cultural appropriateness and context

QUALITY STANDARDS FOR ENHANCED TEXT:
- Must sound like it was originally written by a skilled Hindi writer
- Should flow naturally when read aloud
- Must use vocabulary that educated Hindi speakers find comfortable
- Should demonstrate natural Hindi literary grace
- Must feel authentic, not artificial or over-stylized

FINAL RESULT EXPECTATIONS:
The enhanced text should:
- Be more sophisticated yet natural
- Flow better and be more engaging
- Sound authentically Hindi, not translated
- Use elegant but familiar vocabulary
- Maintain perfect clarity and readability
- Feel like elevated natural Hindi expression

Return only the enhanced text in Hindi, nothing else. The text should sound beautifully natural and authentically Hindi.`
        },
        {
          role: 'user',
          content: `Please enhance the style of this Hindi text to make it more eloquent, engaging, and naturally fluent while keeping the meaning intact:\n\n${inputText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

const parseGrokResponse = (response: string) => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    if (parsed.enhancedText) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse JSON response, treating as plain text:', error);
  }
  
  // Fallback: treat as plain text
  return {
    enhancedText: response.trim(),
    enhancements: []
  };
};

const getUserIdFromToken = async (authHeader: string) => {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Error getting user from token:', error);
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.error('Error in getUserIdFromToken:', error);
    return null;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputText } = await req.json();

    if (!inputText) {
      throw new Error('Input text is required');
    }

    console.log('Style enhancing text with Grok-3:', inputText);
    console.log('Input text length:', inputText.length);

    // Get user ID from authorization header
    const authHeader = req.headers.get('authorization');
    const userId = await getUserIdFromToken(authHeader || '');
    console.log('User ID from token:', userId);

    // Check user tier and apply word limits
    const isPaidUser = userId ? await checkUserTier(userId) : false;
    const wordLimit = isPaidUser ? 1000 : 100;
    const wordCount = inputText.trim().split(/\s+/).length;
    
    console.log(`User tier: ${isPaidUser ? 'paid' : 'free'}, Word limit: ${wordLimit}, Word count: ${wordCount}`);

    if (wordCount > wordLimit) {
      throw new Error(`Text too long. Maximum ${wordLimit} words allowed for ${isPaidUser ? 'paid' : 'free'} users. Your text has ${wordCount} words.`);
    }

    let enhancedResult;
    let usedModel = 'unknown';

    // Try multiple Grok models in order of preference
    const grokModels = ['grok-3', 'grok-3-fast', 'grok-3-beta'];
    
    if (xaiApiKey) {
      for (const model of grokModels) {
        try {
          console.log(`Trying Grok model: ${model}`);
          const grokResponse = await callGrokAPI(inputText, model);
          enhancedResult = parseGrokResponse(grokResponse);
          usedModel = model;
          console.log(`Successfully used Grok model: ${model}`);
          break;
        } catch (error) {
          console.error(`Grok model ${model} failed:`, error);
          if (model === grokModels[grokModels.length - 1]) {
            throw error; // If last Grok model fails, throw the error
          }
        }
      }
    } else {
      throw new Error('XAI API key not configured');
    }

    // Fallback to OpenAI if all Grok models fail
    if (!enhancedResult && openAIApiKey) {
      console.log('All Grok models failed, falling back to OpenAI');
      const openAIResponse = await callOpenAIAPI(inputText);
      enhancedResult = {
        enhancedText: openAIResponse,
        enhancements: []
      };
      usedModel = 'gpt-4.1-2025-04-14';
    }

    if (!enhancedResult) {
      throw new Error('No API keys available for style enhancement');
    }

    console.log('Style enhancement completed successfully');
    console.log('Used model:', usedModel);
    console.log('Enhanced text:', enhancedResult.enhancedText);
    console.log('Number of enhancements:', enhancedResult.enhancements?.length || 0);

    // Maintain backward compatibility - return the expected format
    return new Response(JSON.stringify({ 
      enhancedText: enhancedResult.enhancedText,
      enhancements: enhancedResult.enhancements || [],
      model: usedModel,
      wordCount: wordCount,
      userTier: isPaidUser ? 'paid' : 'free'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in style-enhance function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
