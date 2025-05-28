
export interface PDFFile {
  file: File;
  name: string;
  size: number;
  pages: number;
}

export interface PDFProcessingStatus {
  status: 'idle' | 'uploading' | 'extracting' | 'correcting' | 'generating' | 'completed' | 'error';
  progress: number;
  currentPage?: number;
  totalPages?: number;
  message?: string;
  error?: string;
}

export interface PDFTextContent {
  text: string;
  pageNumber: number;
  formatting?: {
    fontSize?: number;
    fontFamily?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

export interface CorrectedPDF {
  originalText: string;
  correctedText: string;
  corrections: number;
  downloadUrl?: string;
}
