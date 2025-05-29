
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
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `आप एक हिंदी भाषा शैली विशेषज्ञ हैं। आपका कार्य हिंदी टेक्स्ट की शैली को बेहतर बनाना है।

**मुख्य उद्देश्य:**
1. शब्दावली सुधार: सरल शब्दों को बेहतर विकल्पों से बदलें
2. वाक्य प्रवाह: वाक्यों के बीच लय और प्रवाह सुधारें  
3. आकर्षण: टेक्स्ट को और दिलचस्प बनाएं
4. स्पष्टता: शैलीगत सुधार के साथ स्पष्टता बढ़ाएं
5. वाग्मिता: उपयुक्त स्थानों पर साहित्यिक तत्व जोड़ें

**नियम:**
- मूल अर्थ पूर्णतः बनाए रखें
- अधिक परिष्कृत हिंदी शब्दावली का उपयोग करें
- वाक्य संरचना को बेहतर प्रवाह के लिए सुधारें
- टेक्स्ट को अधिक आकर्षक और वाग्मितापूर्ण बनाएं
- प्राकृतिक और पठनीय रखें

**आउटपुट फॉर्मेट:**
JSON फॉर्मेट में उत्तर दें:
{
  "enhancedText": "शैली सुधारा गया पूरा टेक्स्ट",
  "corrections": [
    {
      "incorrect": "मूल शब्द/वाक्यांश",
      "correct": "सुधारा गया शब्द/वाक्यांश",
      "reason": "शैली सुधार का कारण",
      "type": "vocabulary" | "flow" | "eloquence" | "engagement"
    }
  ]
}

केवल वास्तविक शैली सुधार ही corrections में शामिल करें।`
          },
          {
            role: 'user',
            content: `इस हिंदी टेक्स्ट की शैली सुधारें और JSON फॉर्मेट में परिणाम दें:\n\n${inputText}`
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
        enhancedText: responseContent,
        corrections: []
      };
    }

    const { enhancedText, corrections } = parsedResponse;
    
    console.log('Style enhanced text:', enhancedText);
    console.log(`Found ${corrections.length} style improvements`);

    return new Response(JSON.stringify({ enhancedText, corrections }), {
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
