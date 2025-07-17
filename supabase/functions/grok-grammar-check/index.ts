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

    console.log('Correcting Hindi text with Grok 4-0709:', inputText);

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-0709',
        messages: [
          {
            role: 'system',
            content: `You are an expert in Hindi grammar correction.
Your task:

Correct only the following in the given Hindi text:

1. Grammar mistakes (व्याकरण की त्रुटियाँ)
2. Syntax errors (वाक्य संरचना सुधार)
3. Word selection errors (शब्द चयन सुधार) — only if the word is clearly wrong or inappropriate
4. Punctuation errors (विराम चिह्न सुधार)
5. Spelling errors (वर्तनी की गलतियाँ)

Rules:
- Do not change grammatical person or parts of speech unless they are incorrect.
- Do not rephrase for style or add/remove information.
- Do not make any changes except the correction types listed above.
- Be careful of how अनुस्वार की बिंदी & चंद्रबिंदु (ँ) is used in writing words especially.

Instructions:
Return your response in this exact JSON format:
{
  "correctedText": "The fully corrected Hindi text",
  "corrections": [
    {
      "incorrect": "original word/phrase",
      "correct": "corrected version",
      "type": "grammar|syntax|word_selection|punctuation|spelling",
      "reason": "brief explanation in Hindi"
    }
  ]
}

If no corrections are needed, return:
{
  "correctedText": "original text",
  "corrections": []
}`
          },
          {
            role: 'user',
            content: `Please correct the grammatical errors in this Hindi text while keeping the meaning and style intact:\n\n${inputText}`
          }
        ],
        temperature: 0,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error response:', errorText);
      throw new Error(`Grok API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Full Grok API response:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from Grok API');
    }
    
    const rawResponse = data.choices[0].message.content?.trim();
    
    if (!rawResponse) {
      console.error('No content in response:', data.choices[0].message);
      throw new Error('No corrected text received from Grok API');
    }
    
    console.log('Raw Grok response:', rawResponse);

    // Parse JSON response
    let grokResult;
    try {
      grokResult = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON, falling back to text extraction:', parseError);
      // Fallback: extract corrected text from non-JSON response
      const lines = rawResponse.split('\n');
      const correctedText = lines[0] || rawResponse;
      grokResult = {
        correctedText: correctedText,
        corrections: []
      };
    }

    console.log('Parsed Grok result:', grokResult);

    return new Response(JSON.stringify({
      correctedText: grokResult.correctedText || rawResponse,
      corrections: grokResult.corrections || []
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