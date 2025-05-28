
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log('Starting PDF text extraction for file:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to array buffer, size:', arrayBuffer.byteLength);
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log('PDF loaded, number of pages:', pdf.numPages);
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .filter((item: any) => item.str)
        .map((item: any) => item.str)
        .join(' ');
      
      console.log(`Page ${pageNum} text length:`, pageText.length);
      fullText += pageText + '\n\n';
    }
    
    console.log('Total extracted text length:', fullText.length);
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('PDF से टेक्स्ट निकालने में त्रुटि हुई। कृपया सुनिश्चित करें कि PDF में पठनीय टेक्स्ट है।');
  }
};

export const generateCorrectedPDF = async (
  originalText: string,
  correctedText: string,
  filename: string
): Promise<Blob> => {
  try {
    console.log('Generating corrected PDF...');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configure for Hindi text support
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(correctedText, maxWidth);
    console.log('Text split into', lines.length, 'lines');
    
    let yPosition = margin;
    const lineHeight = 7;
    
    // Add title
    doc.setFontSize(16);
    doc.text('व्याकरण सुधारा गया दस्तावेज़', margin, yPosition);
    yPosition += lineHeight * 2;
    
    doc.setFontSize(12);
    
    // Add content
    for (let i = 0; i < lines.length; i++) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines[i], margin, yPosition);
      yPosition += lineHeight;
    }
    
    console.log('PDF generation completed');
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('सुधारी गई PDF बनाने में त्रुटि हुई');
  }
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.pdf', '_corrected.pdf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
