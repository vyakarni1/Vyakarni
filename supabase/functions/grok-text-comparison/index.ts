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
    const { originalText, finalText, processingType } = await req.json();

    if (!originalText || !finalText) {
      throw new Error('Original text and final text are required');
    }

    console.log('Comparing texts for highlighting:', { originalText, finalText, processingType });

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
            content: `You are a Hindi text comparison specialist. Your task is to compare two Hindi texts and identify all differences to create highlighting data for a grammar/style correction interface.

COMPARISON ANALYSIS:
- Compare the original text with the final corrected/enhanced text
- Identify every single word, phrase, or punctuation change
- Determine the type of each change (grammar correction, dictionary replacement, style enhancement, etc.)
- Provide clear reasons for each change in Hindi

OUTPUT REQUIREMENTS:
You must return a JSON object with exactly this structure:

{
  "corrections": [
    {
      "incorrect": "गलत शब्द या वाक्यांश",
      "correct": "सही शब्द या वाक्यांश",
      "reason": "सुधार का विस्तृत कारण हिंदी में",
      "type": "grammar|spelling|punctuation|style|dictionary",
      "source": "grok|dictionary"
    }
  ]
}

CLASSIFICATION RULES:
- "grammar": व्याकरण की त्रुटियां (verb forms, gender, case, etc.)  
- "spelling": वर्तनी की गलतियां (misspelled words)
- "punctuation": विराम चिह्न की त्रुटियां (punctuation errors)
- "style": शैली सुधार (style enhancements, word choice improvements)
- "dictionary": शब्द प्रतिस्थापन (dictionary word replacements)

SOURCE ATTRIBUTION:
- "grok": Changes made by AI grammar/style correction
- "dictionary": Changes made by dictionary word replacements

IMPORTANT INSTRUCTIONS:
- Include ALL differences between original and final text
- Provide educational reasons in Hindi for each correction
- Be precise about what was changed and why
- Focus on changes that help improve Hindi language quality
- Return ONLY the JSON object, no additional text

Example reason formats:
- "व्याकरण सुधार: सही कारक का प्रयोग"
- "वर्तनी सुधार: मानक हिंदी वर्तनी के अनुसार"  
- "शैली सुधार: अधिक प्रभावी अभिव्यक्ति"
- "शब्द प्रतिस्थापन: बेहतर शब्द चयन"`
          },
          {
            role: 'user',
            content: `Compare these two Hindi texts and provide correction data for highlighting:

ORIGINAL TEXT:
${originalText}

FINAL TEXT:
${finalText}

PROCESSING TYPE: ${processingType || 'grammar_check'}

Analyze all differences and return the JSON structure with corrections array.`
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content.trim();

    // Remove any markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\s*|\s*```/g, '');
    
    console.log('Grok comparison response:', aiResponse);

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse Grok response as JSON:', parseError);
      console.error('Grok response was:', aiResponse);
      throw new Error('Invalid JSON response from Grok');
    }

    const { corrections = [] } = parsedResponse;
    
    console.log('Parsed corrections:', corrections);

    return new Response(JSON.stringify({ corrections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-text-comparison function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});