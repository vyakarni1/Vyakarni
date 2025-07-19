
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

    console.log(`Processing text with Vyakarni for grammar correction`);

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
                content: `You are an expert Hindi grammar correction AI. Your task is to correct grammatical errors in Hindi text.

Rules:
1. Fix grammar mistakes (व्याकरण की त्रुटियाँ)
2. Fix spelling errors (वर्तनी की गलतियाँ) 
3. Fix punctuation errors (विराम चिह्न की त्रुटियाँ)
4. Fix syntax errors (वाक्य संरचना की त्रुटियाँ)
5. Fix word selection errors only if the word is clearly wrong

DO NOT:
- Change the meaning, tone, or style
- Rephrase for variety or improvement
- Convert between formal/informal pronouns without grammatical necessity
- Make stylistic changes

Return only the corrected Hindi text, nothing else.`
              },
              {
                role: 'user',
                content: `Please correct the grammatical errors in this Hindi text:\n\n${inputText}`
              }
            ],
            temperature: 0.1,
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
    
    const correctedText = data.choices[0].message.content?.trim();
    
    if (!correctedText) {
      console.error('No content in response:', data.choices[0].message);
      throw new Error('No corrected text received from Grok API');
    }

    console.log(`Grok correction completed successfully`);

    return new Response(JSON.stringify({ 
      correctedText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-grammar-check function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
