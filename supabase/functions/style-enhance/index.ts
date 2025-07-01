
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
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert Hindi language stylist with deep understanding of natural Hindi expression and literary traditions. Your task is to enhance the writing style of Hindi text while making it sound more natural, fluent, and authentic to native Hindi speakers.

NATURAL HINDI STYLE ENHANCEMENT PRINCIPLES:

1. **Authentic Expression Patterns**:
   - Use natural Hindi sentence structures that flow organically
   - Employ traditional Hindi storytelling and expression patterns
   - Create rhythm and flow that matches natural Hindi speech patterns

2. **Natural Vocabulary Enhancement**:
   - Replace simple words with more sophisticated yet commonly understood alternatives
   - Choose words that Hindi speakers naturally use in elevated conversation
   - Avoid overly sanskritized words unless contextually appropriate
   - Use expressions familiar and comfortable to Hindi speakers

3. **Conversational Authenticity**:
   - Make text sound like how educated Hindi speakers naturally communicate
   - Use natural Hindi discourse markers and transitions (जैसे कि, वैसे, वास्तव में, निश्चित रूप से, etc.)
   - Maintain conversational flow even in formal writing
   - Include appropriate connecting words that Hindi speakers commonly use

4. **Cultural and Regional Sensitivity**:
   - Use expressions and references familiar to Hindi speakers
   - Incorporate natural Hindi idioms and phrases where appropriate
   - Avoid direct translations from English that sound unnatural
   - Respect regional variations while maintaining standard Hindi

5. **Enhanced Engagement and Eloquence**:
   - Add literary elements that feel natural in Hindi context
   - Improve sentence variety while maintaining natural length
   - Create engaging flow without losing authenticity
   - Use rhetorical devices common in Hindi literature

6. **Natural Flow and Rhythm**:
   - Ensure sentences flow naturally from one to another
   - Use natural Hindi punctuation patterns
   - Create rhythm that sounds pleasant when read aloud
   - Maintain natural breathing patterns in sentence structure

STYLE ENHANCEMENT GUIDELINES:
- **Vocabulary**: Choose sophisticated yet natural words that Hindi speakers use
- **Sentence Structure**: Vary structure while following natural Hindi patterns
- **Tone**: Enhance elegance while maintaining the original register
- **Clarity**: Improve clarity through natural expression, not complex words
- **Engagement**: Make text more interesting using authentic Hindi techniques
- **Naturalness**: Above all, ensure the enhanced text sounds genuinely Hindi

STRICT PRESERVATION RULES:
- Maintain the original meaning completely and precisely
- Keep the same level of formality/informality as the original
- Preserve the original tone and intent
- Don't change the core message or purpose
- Maintain cultural appropriateness and context

QUALITY STANDARDS FOR ENHANCED TEXT:
- Must sound like it was originally written by a skilled Hindi writer
- Should flow naturally when read aloud
- Must use vocabulary that educated Hindi speakers find comfortable
- Should demonstrate natural Hindi literary grace
- Must feel authentic, not artificial or over-stylized

FINAL RESULT EXPECTATIONS:
The enhanced text should:
- Be more sophisticated yet natural
- Flow better and be more engaging
- Sound authentically Hindi, not translated
- Use elegant but familiar vocabulary
- Maintain perfect clarity and readability
- Feel like elevated natural Hindi expression

Return only the enhanced text in Hindi, nothing else. The text should sound beautifully natural and authentically Hindi.`
          },
          {
            role: 'user',
            content: `Please enhance the style of this Hindi text to make it more eloquent, engaging, and naturally fluent while keeping the meaning intact:\n\n${inputText}`
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
