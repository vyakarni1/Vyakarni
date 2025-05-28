
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Convert PDF to images using a simple canvas-based approach
const convertPDFToImages = async (pdfBase64: string): Promise<string[]> => {
  try {
    // For now, we'll simulate converting PDF to images
    // In a real implementation, you'd use a PDF processing library
    // Since Deno environment is limited, we'll work with the PDF data differently
    
    // Create a simple approach: treat the PDF as a document and extract text directly
    // This is a workaround until we can implement proper PDF-to-image conversion
    return [pdfBase64]; // Return as single "page" for processing
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error('PDF को images में convert करने में त्रुटि');
  }
};

// Extract text using a different approach - direct PDF text extraction
const extractTextFromPDF = async (pdfBase64: string): Promise<string> => {
  try {
    // Use a more direct approach to extract text from PDF
    // Since we can't easily convert to images in Deno, let's extract text directly
    
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
            content: `आप एक विशेषज्ञ हिंदी टेक्स्ट एक्सट्रैक्टर हैं। आपको PDF डेटा से हिंदी टेक्स्ट को सटीक रूप से निकालना है।

निर्देश:
1. दिए गए PDF डेटा से सारा हिंदी टेक्स्ट extract करें
2. Text की original formatting को बनाए रखें
3. केवल extracted text return करें, कोई additional explanation नहीं
4. यदि कोई English text भी है तो उसे भी include करें
5. Line breaks और paragraphs को preserve करें`
          },
          {
            role: 'user',
            content: `कृपया इस PDF से सारा टेक्स्ट extract करें। यह एक हिंदी PDF है। PDF data (base64): ${pdfBase64.substring(0, 1000)}...`
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`Text extraction failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('PDF से text extract करने में त्रुटि');
  }
};

// Correct grammar using OpenAI
const correctGrammar = async (text: string): Promise<string> => {
  try {
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
            content: `इस हिंदी टेक्स्ट को सुधारें:\n\n${text}`
          }
        ],
        max_tokens: 3000,
        temperature: 0.1,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Grammar API error:', errorText);
      throw new Error(`Grammar correction failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error('Error correcting grammar:', error);
    throw new Error('व्याकरण सुधार में त्रुटि');
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

    // Step 1: Extract text directly from PDF using GPT-4
    console.log('Extracting text from PDF using GPT-4...');
    const extractedText = await extractTextFromPDF(pdfBase64);
    
    console.log('Extracted text preview:', extractedText.substring(0, 200) + '...');

    if (!extractedText || extractedText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'PDF से पर्याप्त टेक्स्ट नहीं मिला। कृपया सुनिश्चित करें कि PDF में पठनीय हिंदी टेक्स्ट है।' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Step 2: Correct grammar
    console.log('Correcting grammar...');
    const correctedText = await correctGrammar(extractedText.trim());
    console.log('Grammar correction completed');

    return new Response(
      JSON.stringify({ 
        originalText: extractedText.trim(),
        correctedText,
        pagesProcessed: 1
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
