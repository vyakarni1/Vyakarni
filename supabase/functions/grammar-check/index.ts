
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `आप एक हिंदी व्याकरण सुधार विशेषज्ञ हैं। 

**मुख्य कार्य:**
1. दिए गए हिंदी टेक्स्ट में व्याकरण की त्रुटियों को सुधारें
2. वर्तनी की गलतियों को ठीक करें
3. विराम चिह्न की समस्याओं को हल करें
4. वाक्य संरचना को बेहतर बनाएं
5. शब्द चयन में सुधार करें

**अत्यंत महत्वपूर्ण नियम:**
- पूरा टेक्स्ट वापस करना अनिवार्य है - कोई भी भाग न छोड़ें
- मूल टेक्स्ट की लंबाई बनाए रखें - यह संक्षेपीकरण नहीं है
- सभी पैराग्राफ, वाक्य और विवरण को संरक्षित रखें
- केवल व्याकरण सुधार करें, सामग्री कम न करें
- मूल अर्थ और शैली को बनाए रखें

**आउटपुट फॉर्मेट:**
आपको JSON फॉर्मेट में उत्तर देना है:
{
  "correctedText": "सुधारा गया पूरा टेक्स्ट",
  "corrections": [
    {
      "incorrect": "गलत शब्द/वाक्यांश",
      "correct": "सही शब्द/वाक्यांश",
      "reason": "सुधार का कारण",
      "type": "grammar" | "spelling" | "punctuation" | "syntax" | "vocabulary"
    }
  ]
}

केवल वास्तविक सुधार ही corrections array में शामिल करें। यदि कोई सुधार नहीं है तो corrections array खाली रखें।`
          },
          {
            role: 'user',
            content: `इस हिंदी टेक्स्ट को सुधारें और JSON फॉर्मेट में परिणाम दें:\n\n${preprocessedText}`
          }
        ],
        max_tokens: 16384,
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
    let responseContent = data.choices[0].message.content.trim();

    // Remove any markdown formatting that might wrap the JSON
    responseContent = responseContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    console.log('AI response content:', responseContent);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback: treat as plain text
      parsedResponse = {
        correctedText: responseContent,
        corrections: []
      };
    }

    const { correctedText, corrections } = parsedResponse;

    // Log output word count for monitoring
    const outputWordCount = correctedText.trim().split(/\s+/).length;
    const reductionPercentage = ((inputWordCount - outputWordCount) / inputWordCount) * 100;
    
    console.log(`Output text has ${outputWordCount} words (${inputWordCount} input → ${outputWordCount} output)`);
    console.log(`Word reduction: ${reductionPercentage.toFixed(1)}%`);
    console.log(`Found ${corrections.length} corrections`);

    return new Response(
      JSON.stringify({ correctedText, corrections }), 
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
