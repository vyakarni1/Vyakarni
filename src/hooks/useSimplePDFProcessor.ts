
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUsageStats } from '@/hooks/useUsageStats';
import { extractTextFromPDFSimple, generateSimplePDF } from '@/utils/simplePdfUtils';
import { PDFFile, PDFProcessingStatus, CorrectedPDF } from '@/types/pdf';

export const useSimplePDFProcessor = () => {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [processingStatus, setProcessingStatus] = useState<PDFProcessingStatus>({
    status: 'idle',
    progress: 0
  });
  const [correctedPDF, setCorrectedPDF] = useState<CorrectedPDF | null>(null);
  const { trackUsage } = useUsageStats();

  const uploadPDF = (file: File) => {
    if (!file.type.includes('pdf')) {
      toast.error('कृपया केवल PDF फ़ाइल अपलोड करें');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('फ़ाइल का साइज़ 10MB से कम होना चाहिए');
      return;
    }

    setPdfFile({
      file,
      name: file.name,
      size: file.size,
      pages: 0
    });

    setProcessingStatus({
      status: 'idle',
      progress: 0,
      message: 'PDF अपलोड हो गई - प्रक्रिया शुरू करने के लिए तैयार'
    });

    toast.success('PDF सफलतापूर्वक अपलोड हुई!');
  };

  const processPDF = async () => {
    if (!pdfFile) {
      toast.error('कृपया पहले एक PDF फ़ाइल अपलोड करें');
      return;
    }

    try {
      // Step 1: Extract text using simple method
      setProcessingStatus({
        status: 'extracting',
        progress: 20,
        message: 'PDF से टेक्स्ट निकाला जा रहा है...'
      });

      console.log('Starting simple PDF processing...');
      const pdfBase64 = await extractTextFromPDFSimple(pdfFile.file);
      
      // Step 2: Send to edge function for text extraction and correction
      setProcessingStatus({
        status: 'correcting',
        progress: 50,
        message: 'व्याकरण सुधार हो रहा है...'
      });

      console.log('Sending PDF to processing API...');
      const { data, error } = await supabase.functions.invoke('simple-pdf-grammar-check', {
        body: {
          pdfBase64,
          filename: pdfFile.name
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`प्रोसेसिंग में त्रुटि: ${error.message}`);
      }

      if (!data || !data.correctedText) {
        console.error('No corrected text received:', data);
        throw new Error('सुधारा गया टेक्स्ट प्राप्त नहीं हुआ');
      }

      console.log('Received corrected text:', data.correctedText.substring(0, 200) + '...');

      // Step 3: Generate new PDF
      setProcessingStatus({
        status: 'generating',
        progress: 80,
        message: 'सुधारी गई PDF बनाई जा रही है...'
      });

      const correctedBlob = await generateSimplePDF(data.correctedText, pdfFile.name);
      const downloadUrl = URL.createObjectURL(correctedBlob);

      setCorrectedPDF({
        originalText: data.originalText || 'मूल टेक्स्ट',
        correctedText: data.correctedText,
        corrections: data.correctedText !== (data.originalText || '') ? 1 : 0,
        downloadUrl
      });

      setProcessingStatus({
        status: 'completed',
        progress: 100,
        message: 'प्रक्रिया पूर्ण हुई!'
      });

      // Track usage
      await trackUsage('pdf_grammar_check');
      
      toast.success('PDF व्याकरण सुधार पूरा हो गया!');

    } catch (error) {
      console.error('Error processing PDF:', error);
      setProcessingStatus({
        status: 'error',
        progress: 0,
        error: error.message || 'PDF प्रोसेसिंग में त्रुटि हुई'
      });
      toast.error(`त्रुटि: ${error.message || 'कुछ गलत हुआ है'}`);
    }
  };

  const reset = () => {
    setPdfFile(null);
    setCorrectedPDF(null);
    setProcessingStatus({
      status: 'idle',
      progress: 0
    });
  };

  const downloadCorrectedPDF = () => {
    if (correctedPDF?.downloadUrl && pdfFile) {
      const link = document.createElement('a');
      link.href = correctedPDF.downloadUrl;
      link.download = pdfFile.name.replace('.pdf', '_corrected.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF डाउनलोड हो गई!');
    }
  };

  return {
    pdfFile,
    processingStatus,
    correctedPDF,
    uploadPDF,
    processPDF,
    reset,
    downloadCorrectedPDF
  };
};
