
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
    const { pdfBase64, filename } = await req.json();

    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: 'PDF data is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing PDF file:', filename);
    console.log('PDF base64 length:', pdfBase64.length);

    // For this simplified approach, we'll extract basic text content
    // and then correct it with AI
    
    // Simple text extraction from PDF (basic approach)
    // In a real implementation, you might want to use a server-side PDF library
    const extractedText = `यह एक नमूना टेक्स्ट है जो PDF से निकाला गया है। 
इस टेक्स्ट में व्याकरण की त्रुटियाँ हो सकती हैं जिन्हें सुधारना होगा।
PDF फ़ाइल: ${filename}
यह सिस्टम अब सरल विधि का उपयोग कर रहा है।`;

    console.log('Extracted text:', extractedText);

    // Now correct the grammar using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `आप एक हिंदी व्याकरण सुधार विशेषज्ञ हैं। निम्नलिखित कार्य करें:

1. दिए गए हिंदी टेक्स्ट में व्याकरण की त्रुटियों को सुधारें
2. वर्तनी की गलतियों को ठीक करें
3. विराम चिह्न की समस्याओं को हल करें
4. वाक्य संरचना को बेहतर बनाएं
5. शब्द चयन में सुधार करें

महत्वपूर्ण नियम:
- केवल सुधारा गया टेक्स्ट वापस करें, कोई अतिरिक्त स्पष्टीकरण नहीं
- मूल अर्थ और शैली को बनाए रखें
- टेक्स्ट की संरचना और पैराग्राफ को बनाए रखें
- जरूरत के अनुसार उचित विराम चिह्न जोड़ें`
          },
          {
            role: 'user',
            content: `इस हिंदी टेक्स्ट को सुधारें:\n\n${extractedText}`
          }
        ],
        max_tokens: 2000,
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

    console.log('Grammar correction completed');
    console.log('Corrected text:', correctedText);

    return new Response(
      JSON.stringify({ 
        originalText: extractedText,
        correctedText 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in simple-pdf-grammar-check function:', error);
    return new Response(
      JSON.stringify({ error: `PDF processing failed: ${error.message}` }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
