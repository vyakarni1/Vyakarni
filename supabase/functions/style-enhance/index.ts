
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    console.log('Enhancing style for text:', inputText);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert Hindi language stylist. Your task is to enhance the writing style of Hindi text while maintaining its original meaning. Focus on:

1. Vocabulary Enhancement: Replace simple words with more sophisticated alternatives
2. Sentence Flow: Improve rhythm and flow between sentences  
3. Engagement: Make text more engaging and interesting
4. Clarity: Improve clarity while adding stylistic flair
5. Eloquence: Add literary elements where appropriate

Guidelines:
- Maintain the original meaning completely
- Use more sophisticated Hindi vocabulary where appropriate
- Improve sentence structure for better flow
- Make the text more engaging and eloquent
- Keep it natural and readable
- Focus on style improvement, not grammar correction

Return only the enhanced text in Hindi, nothing else.`
          },
          {
            role: 'user',
            content: `Please enhance the style of this Hindi text while keeping the meaning intact:\n\n${inputText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedText = data.choices[0].message.content.trim();
    
    console.log('Style enhanced text:', enhancedText);

    return new Response(JSON.stringify({ enhancedText }), {
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
