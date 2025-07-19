
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const xaiApiKey = Deno.env.get('XAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (!xaiApiKey) {
      throw new Error('XAI API key not configured');
    }

    console.log(`Processing text with Vyakarni for style enhancement`);

    // Try different Grok-3 model names as per X.AI documentation
    const modelNames = ['grok-3', 'grok-3-fast', 'grok-3-beta'];
    let response;
    let lastError;

    for (const modelName of modelNames) {
      try {
        console.log(`Attempting with model: ${modelName}`);
        
        response = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${xaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: 'system',
                content: `You are an expert Hindi language stylist. Your task is to enhance the writing style of Hindi text while making it sound more natural, fluent, and eloquent.

Guidelines:
1. Use more sophisticated yet natural vocabulary
2. Improve sentence flow and rhythm
3. Make text more engaging and eloquent
4. Enhance clarity through better expression
5. Add literary grace while maintaining naturalness
6. Use बिंदु (ं) instead of चंद्रबिंदु (ँ) in words like 'बायीं' and 'दायीं' unless the nasalized vowel explicitly requires चंद्रबिंदु as per standard Hindi orthography.

Maintain:
- Original meaning completely
- Same level of formality/informality
- Original tone and intent
- Cultural appropriateness

Return only the enhanced Hindi text, nothing else.`
              },
              {
                role: 'user',
                content: `Please enhance the style of this Hindi text to make it more eloquent and engaging:\n\n${inputText}`
              }
            ],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        });

        if (response.ok) {
          console.log(`Successfully connected with model: ${modelName}`);
          break;
        } else {
          const errorText = await response.text();
          lastError = `Model ${modelName} failed: ${response.status} - ${errorText}`;
          console.log(lastError);
        }
      } catch (error) {
        lastError = `Model ${modelName} error: ${error.message}`;
        console.log(lastError);
      }
    }

    if (!response || !response.ok) {
      console.error('All Grok model attempts failed:', lastError);
      throw new Error(`Grok API error: ${lastError}`);
    }

    const data = await response.json();
    console.log('Grok API response received:', data.choices?.[0]?.message?.content ? 'Success' : 'No content');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from Grok API');
    }
    
    const enhancedText = data.choices[0].message.content?.trim();
    
    if (!enhancedText) {
      console.error('No content in response:', data.choices[0].message);
      throw new Error('No enhanced text received from Grok API');
    }

    console.log(`Grok style enhancement completed successfully`);

    return new Response(JSON.stringify({ 
      enhancedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-style-enhance function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
