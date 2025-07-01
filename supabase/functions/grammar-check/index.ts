
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
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a Hindi grammar correction specialist with deep understanding of natural Hindi expression. Your task is to correct ONLY the following types of errors while ensuring the text sounds naturally fluent and authentic to native Hindi speakers.

CORRECTION TYPES ALLOWED:
1. Grammar mistakes (व्याकरण की त्रुटियां)
2. Syntax improvements (वाक्य संरचना सुधार)
3. Word selection enhancement (शब्द चयन सुधार) - ONLY when words are clearly incorrect or inappropriate
4. Punctuation correction (विराम चिह्न सुधार)
5. Spelling errors (वर्तनी की गलतियां)

NATURAL HINDI WRITING GUIDELINES:
1. **Natural Expression Patterns**: Use authentic Hindi sentence structures that flow naturally
2. **Contextual Word Choice**: Choose words that Hindi speakers commonly use in daily conversation
3. **Conversational Flow**: Ensure text maintains natural Hindi speaking rhythms and patterns
4. **Cultural Appropriateness**: Use expressions that feel genuine to Hindi speakers
5. **Natural Transitions**: Include appropriate Hindi discourse markers (जैसे कि, वैसे, फिर भी, इसलिए, etc.)
6. **Avoid Artificial Language**: Don't use overly sanskritized or bookish words unless contextually appropriate
7. **Natural Sentence Length**: Use sentence lengths that match how Hindi speakers naturally communicate
8. **Authentic Tone**: Make corrections sound like they were originally written in Hindi, not translated

WORD SELECTION PRINCIPLES:
- Prefer commonly used Hindi words over rare/archaic alternatives
- Choose words that sound natural in the given context
- Use expressions familiar to Hindi speakers in daily life
- Maintain the original register (formal/informal) while making it sound natural

STRICT PRESERVATION RULES:
- DO NOT change any word that has been corrected or replaced by dictionary under any circumstances
- DO NOT change meaning, tone, and level of politeness, respectfulness, or formality in the given text
- DO NOT convert 'तुम' to 'आप' or 'हम' to 'मैं', and vice versa
- DO NOT change the level of formality or informality of the text
- DO NOT replace correct words with synonyms just for variety
- DO NOT make stylistic changes unless there are actual grammatical errors
- DO NOT change casual/formal tone or pronouns without grammatical necessity

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
            content: `Please correct the grammatical errors in this Hindi text and make it sound more natural and fluent while following the JSON format specified:\n\n${preprocessedText}`
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
