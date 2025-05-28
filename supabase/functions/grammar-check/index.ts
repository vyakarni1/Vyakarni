
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inputText, wordReplacements } = await req.json();

    if (!inputText || !inputText.trim()) {
      return new Response(
        JSON.stringify({ error: 'Input text is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create instruction set for AI based on word replacements
    const wordReplacementInstructions = wordReplacements
      .map(({ original, replacement }) => `"${original}" को "${replacement}" से बदलें`)
      .join(', ');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Hindi grammar correction expert. Follow these specific word replacement rules: ${wordReplacementInstructions}. Additionally, correct any grammatical errors, punctuation mistakes, sentence structure issues, and word choice problems in the given Hindi text while maintaining the original meaning and style. Only return the corrected text, no explanations or additional text.`
          },
          {
            role: 'user',
            content: `कृपया इस हिंदी टेक्स्ट में सभी व्याकरण की त्रुटियों, वर्तनी की गलतियों, विराम चिह्न की समस्याओं और वाक्य संरचना की त्रुटियों को सुधारें। दिए गए शब्द प्रतिस्थापन नियमों का पूर्ण पालन करें: "${inputText}"`
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const correctedText = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ correctedText }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in grammar-check function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
