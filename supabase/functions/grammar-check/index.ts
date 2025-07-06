
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
    const { inputText } = await req.json();

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

    console.log('Original text:', inputText);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a Hindi grammar correction specialist. Your task is to apply MINIMAL CORRECTION PRINCIPLE - fix ONLY actual errors, nothing more.

MINIMAL CORRECTION PRINCIPLE:
- Fix ONLY actual errors: spelling mistakes, grammar errors, punctuation errors
- DO NOT change correct words or phrases
- DO NOT make stylistic improvements 
- DO NOT rephrase sentences unless grammatically incorrect
- PRESERVE original meaning, tone, and formality completely

STRICT "DO NOT CHANGE" RULES:
- Do not change any word that is already spelled correctly
- Do not change sentence structure unless there's a grammatical error
- Do not convert between formal/informal pronouns (तुम/आप)
- Do not replace synonyms for variety
- Do not add or remove words unless fixing clear errors
- Do not change casual/formal tone or pronouns without grammatical necessity
- Do not change any word that has been corrected or replaced by dictionary

CORRECTION EXAMPLES:
✅ Fix: "मै जा रहा हु" → "मैं जा रहा हूं" (spelling/grammar error)
✅ Fix: "वो खाना खा रहा है।" → "वह खाना खा रहा है।" (grammar error)
❌ Don't: "अच्छा" → "बेहतरीन" (stylistic change)
❌ Don't: "तुम कैसे हो" → "आप कैसे हैं" (formality change)
❌ Don't: "बहुत अच्छा" → "बहुत बढ़िया" (synonym replacement)

ONLY CORRECT THESE ERROR TYPES:
1. Spelling errors (वर्तनी की गलतियां)
2. Grammar mistakes (व्याकरण की त्रुटियां) 
3. Punctuation errors (विराम चिह्न की त्रुटियां)
4. Syntax errors (वाक्य संरचना की त्रुटियां) - only when grammatically wrong

OUTPUT REQUIREMENTS:
You must return a JSON object with exactly this structure:
{
  "correctedText": "The corrected Hindi text here - must sound natural and fluent",
  "corrections": [
    {
      "incorrect": "गलत शब्द या वाक्यांश",
      "correct": "सही शब्द या वाक्यांश", 
      "reason": "सुधार का विस्तृत कारण हिंदी में - explain why this makes the text more natural",
      "type": "grammar|spelling|punctuation|syntax"
    }
  ]
}

IMPORTANT INSTRUCTIONS FOR CORRECTIONS LIST:
- Only include significant grammatical corrections that you actually made
- DO NOT include dictionary word replacements in the corrections list
- Each correction should have a clear, educational reason in Hindi explaining how it improves naturalness
- Use these types: "grammar" for व्याकरण, "spelling" for वर्तनी, "punctuation" for विराम चिह्न, "syntax" for वाक्य संरचना
- If no corrections are needed, return an empty corrections array
- Be precise about what was changed and why it makes the Hindi more natural

FINAL QUALITY CHECK:
Before returning, ensure the corrected text:
- Sounds like natural, fluent Hindi
- Maintains original meaning and tone
- Uses words Hindi speakers commonly use
- Has natural flow and rhythm
- Feels authentic, not translated

Return ONLY the JSON object, no additional text or explanations.`
          },
          {
            role: 'user',
            content: `Please correct the grammatical errors in this Hindi text and make it sound more natural and fluent while following the JSON format specified:\n\n${inputText}`
          }
        ],
        max_tokens: 16000,
        temperature: 0.05,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content.trim();

    // Remove any markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\s*|\s*```/g, '');
    
    console.log('AI raw response:', aiResponse);

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI response was:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    const { correctedText, corrections = [] } = parsedResponse;

    if (!correctedText) {
      throw new Error('No corrected text in AI response');
    }

    console.log('Parsed corrected text:', correctedText);
    console.log('Parsed corrections:', corrections);

    // Log output word count for monitoring
    const outputWordCount = correctedText.trim().split(/\s+/).length;
    console.log(`Output text has ${outputWordCount} words (${inputWordCount} input → ${outputWordCount} output)`);
    console.log(`Found ${corrections.length} corrections`);

    return new Response(
      JSON.stringify({ 
        correctedText,
        corrections: corrections || []
      }), 
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
