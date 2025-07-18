
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
    const { inputText, userTier = 'free' } = await req.json();

    if (!inputText) {
      throw new Error('Input text is required');
    }

    // Dynamic word limit based on user tier
    const wordLimit = userTier === 'paid' ? 1000 : 100;
    const wordCount = inputText.trim().split(/\s+/).length;
    
    if (wordCount > wordLimit) {
      throw new Error(`Text exceeds ${wordLimit} word limit for ${userTier} users. Current text has ${wordCount} words.`);
    }

    console.log(`Processing ${wordCount} words with Grok-3 for ${userTier} user`);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3-large',
        messages: [
          {
            role: 'system',
            content: `You are an expert Hindi grammar correction AI.

Your task: Correct ONLY grammatical errors in the given Hindi text.

CORRECTION RULES:
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

OUTPUT FORMAT:
Return a JSON object with this exact structure:
{
  "correctedText": "The fully corrected Hindi text here",
  "corrections": [
    {
      "incorrect": "गलत शब्द या वाक्यांश",
      "correct": "सही शब्द या वाक्यांश",
      "reason": "सुधार का कारण हिंदी में",
      "type": "grammar|spelling|punctuation|syntax",
      "source": "ai"
    }
  ]
}

Return ONLY the JSON object, no additional text.`
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error response:', errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Grok API response received:', data.choices?.[0]?.message?.content ? 'Success' : 'No content');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from Grok API');
    }
    
    const aiResponse = data.choices[0].message.content?.trim();
    
    if (!aiResponse) {
      console.error('No content in response:', data.choices[0].message);
      throw new Error('No corrected text received from Grok API');
    }

    // Parse JSON response
    let parsedResponse;
    try {
      const cleanedResponse = aiResponse.replace(/```json\s*|\s*```/g, '');
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI response was:', aiResponse);
      
      // Fallback: treat entire response as corrected text
      parsedResponse = {
        correctedText: aiResponse,
        corrections: []
      };
    }

    const { correctedText, corrections = [] } = parsedResponse;
    
    console.log(`Grok correction completed: ${corrections.length} AI corrections found`);

    return new Response(JSON.stringify({ 
      correctedText,
      corrections: corrections.map(c => ({ ...c, source: 'ai' }))
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
