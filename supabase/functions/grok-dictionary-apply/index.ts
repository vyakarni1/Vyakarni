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
    const { correctedText, wordReplacements } = await req.json();

    if (!correctedText || !wordReplacements) {
      throw new Error('Corrected text and word replacements are required');
    }

    console.log('Applying dictionary to corrected text:', correctedText);
    console.log('Dictionary replacements:', wordReplacements.length);

    const dictionaryString = wordReplacements.map(item => 
      `"${item.original}" → "${item.replacement}"`
    ).join('\n');

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-3',
        messages: [
          {
            role: 'system',
            content: `You are a Hindi text dictionary replacement specialist. Your task is to apply dictionary word replacements to the given Hindi text with perfect accuracy.

DICTIONARY REPLACEMENT RULES:
1. Apply ONLY the exact word replacements provided in the dictionary
2. Replace words ONLY if they match exactly (case-sensitive when appropriate)
3. Maintain the original text structure, spacing, and punctuation
4. Do NOT make any other changes to the text
5. Do NOT correct grammar, spelling, or style - only apply dictionary replacements
6. If a word appears multiple times, replace ALL instances
7. Apply replacements in the order they appear in the dictionary

CRITICAL INSTRUCTIONS:
- Return ONLY the text with dictionary replacements applied
- Do NOT add explanations, comments, or additional text
- Preserve all original formatting, line breaks, and punctuation
- If no dictionary replacements apply, return the original text unchanged

The dictionary format is: "original_word" → "replacement_word"`
          },
          {
            role: 'user',
            content: `Apply these dictionary replacements to the given Hindi text:

DICTIONARY:
${dictionaryString}

TEXT TO PROCESS:
${correctedText}

Return only the text with dictionary replacements applied, nothing else.`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const textWithDictionary = data.choices[0].message.content.trim();
    
    console.log('Text after dictionary application:', textWithDictionary);

    return new Response(JSON.stringify({ textWithDictionary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-dictionary-apply function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});