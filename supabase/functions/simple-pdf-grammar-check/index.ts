
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple PDF text extraction function
const extractTextFromPDF = (pdfBase64: string): string => {
  try {
    // Convert base64 to binary
    const binaryString = atob(pdfBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Simple text extraction - look for text between BT and ET operators
    const pdfText = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    
    // Extract text using basic PDF text patterns
    const textMatches = pdfText.match(/\(([^)]+)\)/g);
    let extractedText = '';
    
    if (textMatches) {
      extractedText = textMatches
        .map(match => match.slice(1, -1)) // Remove parentheses
        .filter(text => text.length > 0)
        .join(' ')
        .replace(/\\([nrt])/g, ' ') // Replace escape sequences
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    }
    
    // If no text found with parentheses method, try alternative extraction
    if (!extractedText || extractedText.length < 10) {
      // Look for readable text patterns in the PDF
      const readableText = pdfText.match(/[\u0900-\u097F\u0020-\u007E]{3,}/g);
      if (readableText) {
        extractedText = readableText
          .filter(text => text.trim().length > 2)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
    }
    
    return extractedText || 'PDF से टेक्स्ट निकालने में समस्या हुई';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return 'PDF टेक्स्ट एक्सट्रैक्शन में त्रुटि';
  }
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

    // Extract text from PDF
    const extractedText = extractTextFromPDF(pdfBase64);
    console.log('Extracted text:', extractedText);

    if (!extractedText || extractedText.length < 5) {
      return new Response(
        JSON.stringify({ error: 'PDF से पर्याप्त टेक्स्ट नहीं मिला। कृपया सुनिश्चित करें कि PDF में हिंदी टेक्स्ट है।' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
