
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PDFUploaderProps {
  onUpload: (file: File) => void;
  uploadedFile?: { name: string; size: number } | null;
  onRemove?: () => void;
  disabled?: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({
  onUpload,
  uploadedFile,
  onRemove,
  disabled = false
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadedFile) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">{formatFileSize(uploadedFile.size)}</p>
              </div>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-dashed transition-all duration-200 ${
      isDragActive 
        ? 'border-blue-400 bg-blue-50' 
        : disabled 
          ? 'border-gray-200 bg-gray-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
    }`}>
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`text-center cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className={`mx-auto h-12 w-12 mb-4 ${
            isDragActive ? 'text-blue-500' : disabled ? 'text-gray-400' : 'text-gray-500'
          }`} />
          
          {isDragActive ? (
            <p className="text-lg font-medium text-blue-600 mb-2">
              PDF फ़ाइल यहाँ छोड़ें...
            </p>
          ) : (
            <>
              <p className={`text-lg font-medium mb-2 ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              }`}>
                PDF फ़ाइल अपलोड करें
              </p>
              <p className={`text-sm mb-4 ${
                disabled ? 'text-gray-400' : 'text-gray-500'
              }`}>
                अपनी PDF फ़ाइल को यहाँ खींचें और छोड़ें या क्लिक करके चुनें
              </p>
            </>
          )}
          
          <div className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>• केवल PDF फ़ाइलें समर्थित हैं</p>
            <p>• अधिकतम फ़ाइल साइज़: 10MB</p>
            <p>• फ़ाइल में हिंदी टेक्स्ट होना चाहिए</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
