
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

    // Estimate input word count for logging
    const inputWordCount = inputText.trim().split(/\s+/).length;
    console.log(`Processing text with ${inputWordCount} words`);

    // Apply word replacements first
    let preprocessedText = inputText;
    if (wordReplacements && Array.isArray(wordReplacements)) {
      wordReplacements.forEach(({ original, replacement }) => {
        const regex = new RegExp(original, 'g');
        preprocessedText = preprocessedText.replace(regex, replacement);
      });
    }

    console.log('Original text:', inputText);
    console.log('After word replacements:', preprocessedText);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.5-preview',
        messages: [
          {
            role: 'system',
            content: `You are a Hindi grammar correction specialist. Your task is to correct ONLY the following types of errors in the provided Hindi text:

CORRECTION TYPES ALLOWED:
1. Grammar mistakes (व्याकरण की त्रुटियां)
2. Syntax improvements (वाक्य संरचना सुधार)
3. Word selection enhancement (शब्द चयन सुधार) - ONLY when words are clearly incorrect or inappropriate
4. Punctuation correction (विराम चिह्न सुधार)
5. Spelling errors (वर्तनी की गलतियां)

STRICT PRESERVATION RULES:
- GPT will NOT change any word that has been corrected or replaced by dictionary under any circumstances
- GPT will NOT change meaning, tone, and level of politeness, respectfulness, or formality in the given text
- GPT will NOT convert 'तुम' to 'आप' or 'हम' to 'मैं', and vice versa
- GPT will NOT change the level of formality or informality of the text

WHAT NOT TO CHANGE:
- Avoid rewriting and beautifying sentences unnecessarily
- Should avoid word order change unnecessarily
- Do NOT replace correct words with synonyms just for variety
- Do NOT make stylistic changes unless there are actual grammatical errors
- Do NOT change casual/formal tone or pronouns without grammatical necessity

OUTPUT REQUIREMENTS:
- Return ONLY the corrected text, no explanations or additional comments
- Preserve the original paragraph structure and formatting
- Only make changes where there are clear errors
- If the text is already grammatically correct, return it unchanged
- Maintain the original writing style and voice`
          },
          {
            role: 'user',
            content: `Please correct only the grammatical errors in this Hindi text following the strict rules above:\n\n${preprocessedText}`
          }
        ],
        max_tokens: 16000,
        temperature: 0.1,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    let correctedText = data.choices[0].message.content.trim();

    // Remove any quotation marks that might have been added by the AI
    correctedText = correctedText.replace(/^["']|["']$/g, '');

    console.log('AI corrected text:', correctedText);

    // Log output word count for monitoring
    const outputWordCount = correctedText.trim().split(/\s+/).length;
    console.log(`Output text has ${outputWordCount} words (${inputWordCount} input → ${outputWordCount} output)`);

    return new Response(
      JSON.stringify({ correctedText }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in grammar-check function:', error);
    return new Response(
      JSON.stringify({ error: `Grammar correction failed: ${error.message}` }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
