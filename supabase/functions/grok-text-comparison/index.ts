import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { originalText, finalText, processingType, textHistoryId } = await req.json();

    if (!originalText || !finalText) {
      throw new Error('Original text and final text are required');
    }

    console.log('Comparing texts for highlighting:', { originalText, finalText, processingType });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content.trim();

    // Remove any markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\s*|\s*```/g, '');
    
    console.log('OpenAI comparison response:', aiResponse);

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('OpenAI response was:', aiResponse.substring(0, 1000) + '...[truncated]');
      
      // Try to extract whatever corrections we can from partial JSON
      try {
        // If the response starts with { and contains "corrections", try to fix it
        if (aiResponse.startsWith('{') && aiResponse.includes('"corrections"')) {
          // Find the last complete correction object
          const lastCompleteMatch = aiResponse.lastIndexOf('"}');
          if (lastCompleteMatch > -1) {
            const truncatedResponse = aiResponse.substring(0, lastCompleteMatch + 2) + ']}';
            parsedResponse = JSON.parse(truncatedResponse);
            console.log('Successfully parsed truncated response');
          } else {
            throw new Error('Cannot recover from truncated response');
          }
        } else {
          throw new Error('Response format is not recoverable');
        }
      } catch (recoveryError) {
        console.error('Could not recover from truncated response:', recoveryError);
        // Return empty corrections array as fallback
        parsedResponse = { corrections: [] };
      }
    }

    const { corrections = [] } = parsedResponse;
    
    console.log('Parsed corrections:', corrections);

    // Update text history with corrections if textHistoryId is provided
    if (textHistoryId && corrections.length > 0) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('text_corrections')
          .update({ corrections_data: corrections })
          .eq('id', textHistoryId);
          
        console.log('Updated text history with corrections');
      } catch (updateError) {
        console.error('Failed to update text history:', updateError);
      }
    }

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