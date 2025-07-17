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

    console.log('Correcting Hindi text with Grok 3:', inputText);

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
            content: `You are an expert Hindi grammar correction specialist with deep knowledge of Hindi language rules, syntax, and proper usage. Your task is to correct grammatical errors in Hindi text while preserving the original meaning and style.

HINDI GRAMMAR CORRECTION GUIDELINES:

1. **Grammatical Error Types to Fix**:
   - Verb conjugation errors (क्रिया रूप की त्रुटियां)
   - Gender agreement errors (लिंग की त्रुटियां) 
   - Case marker errors (कारक चिह्न की त्रुटियां)
   - Number agreement errors (वचन की त्रुटियां)
   - Tense consistency errors (काल की त्रुटियां)
   - Sentence structure problems (वाक्य संरचना की समस्याएं)

2. **Spelling and Writing System**:
   - Correct Devanagari script usage
   - Fix मात्रा (vowel diacritic) errors
   - Correct conjunct consonant usage
   - Fix half-letters (हलन्त) placement
   - Correct compound word formation

3. **Word Usage and Vocabulary**:
   - Replace incorrect word choices with appropriate alternatives
   - Fix colloquial terms with standard Hindi when appropriate
   - Ensure proper formal/informal register consistency
   - Correct idiom and phrase usage

4. **Punctuation and Formatting**:
   - Add missing punctuation marks (।, ?, !, etc.)
   - Correct spacing issues
   - Fix paragraph structure when needed
   - Ensure proper use of Devanagari punctuation

5. **STRICT PRESERVATION RULES**:
   - Keep the original meaning completely intact
   - Maintain the same tone and style (formal/informal)
   - Preserve the author's intended message
   - Don't change the core content or ideas
   - Don't add new information or elaborate beyond correction

IMPORTANT INSTRUCTIONS:
- Return ONLY the corrected Hindi text
- Do NOT provide explanations, comments, or additional text
- Do NOT translate to other languages
- Focus purely on grammatical and linguistic accuracy
- If the text is already correct, return it unchanged

The corrected text should be grammatically perfect, spell-checked, and follow standard Hindi language conventions while preserving the original meaning and style.`
          },
          {
            role: 'user',
            content: `Please correct the grammatical errors in this Hindi text while keeping the meaning and style intact:\n\n${inputText}`
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
    const correctedText = data.choices[0].message.content.trim();
    
    console.log('Grok corrected text:', correctedText);

    return new Response(JSON.stringify({ correctedText }), {
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