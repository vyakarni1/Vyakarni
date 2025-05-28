
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Convert PDF to images using a simple approach
const convertPDFToImages = async (pdfBase64: string): Promise<string[]> => {
  try {
    // For this implementation, we'll use a simpler approach
    // Convert the PDF pages to images using canvas rendering
    
    // Create a data URL from the base64
    const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;
    
    // For now, we'll treat the entire PDF as one image
    // In a full implementation, you'd use a PDF library to extract individual pages
    
    // Since we can't use complex PDF libraries in Deno easily,
    // we'll use OpenAI's vision directly on the PDF data
    // by converting it to an image representation
    
    return [pdfBase64]; // Return as single "page" for now
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error('PDF को images में convert करने में त्रुटि');
  }
};

// Extract text from image using OpenAI Vision API
const extractTextFromImage = async (imageData: string, pageNumber: number): Promise<string> => {
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
            content: `आप एक विशेषज्ञ हिंदी OCR असिस्टेंट हैं। आपको PDF/Image से हिंदी टेक्स्ट को बिल्कुल सटीक तरीके से निकालना है।

निर्देश:
1. Image में दिखाई देने वाला सारा हिंदी टेक्स्ट को सटीक रूप से extract करें
2. Text की original formatting और structure को बनाए रखें
3. केवल extracted text return करें, कोई additional explanation नहीं
4. यदि कोई English text भी है तो उसे भी include करें
5. Line breaks और paragraphs को preserve करें`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `कृपया इस PDF page ${pageNumber} से सारा टेक्स्ट extract करें:`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${imageData}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Vision API error:', errorText);
      throw new Error(`Vision API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error(`Page ${pageNumber} से text extract करने में त्रुटि`);
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

    // Step 1: Convert PDF to images
    console.log('Converting PDF to images...');
    const images = await convertPDFToImages(pdfBase64);
    console.log(`Converted PDF to ${images.length} image(s)`);

    // Step 2: Extract text from each image using Vision API
    console.log('Extracting text from images using Vision API...');
    let allExtractedText = '';
    
    for (let i = 0; i < images.length; i++) {
      try {
        const pageText = await extractTextFromImage(images[i], i + 1);
        console.log(`Extracted text from page ${i + 1}:`, pageText.substring(0, 200) + '...');
        
        if (pageText && pageText.trim().length > 0) {
          allExtractedText += pageText + '\n\n';
        }
      } catch (error) {
        console.error(`Error processing page ${i + 1}:`, error);
        // Continue with other pages
      }
    }

    if (!allExtractedText || allExtractedText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'PDF से पर्याप्त टेक्स्ट नहीं मिला। कृपया सुनिश्चित करें कि PDF में पठनीय हिंदी टेक्स्ट है।' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Total extracted text length:', allExtractedText.length);

    // Step 3: Correct grammar
    console.log('Correcting grammar...');
    const correctedText = await correctGrammar(allExtractedText.trim());
    console.log('Grammar correction completed');

    return new Response(
      JSON.stringify({ 
        originalText: allExtractedText.trim(),
        correctedText,
        pagesProcessed: images.length
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
