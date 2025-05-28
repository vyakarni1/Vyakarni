
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, CheckCircle } from 'lucide-react';
import { CorrectedPDF } from '@/types/pdf';

interface CorrectedPDFViewerProps {
  correctedPDF: CorrectedPDF;
  onDownload: () => void;
  filename: string;
}

const CorrectedPDFViewer: React.FC<CorrectedPDFViewerProps> = ({
  correctedPDF,
  onDownload,
  filename
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const previewText = correctedPDF.correctedText.substring(0, 500);
  const hasMoreText = correctedPDF.correctedText.length > 500;

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>सुधारी गई PDF तैयार है!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-800">
                {filename.replace('.pdf', '_corrected.pdf')}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              सुधार: {correctedPDF.corrections} बदलाव
            </div>
          </div>

          {showPreview ? (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-800 mb-2">सुधारा गया टेक्स्ट:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {previewText}
                  {hasMoreText && '...'}
                </p>
                {hasMoreText && (
                  <p className="text-xs text-gray-500 mt-2">
                    (पूरा टेक्स्ट देखने के लिए PDF डाउनलोड करें)
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="w-full"
              >
                प्रीव्यू छुपाएं
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>टेक्स्ट प्रीव्यू देखें</span>
            </Button>
          )}
        </div>

        <Button
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          सुधारी गई PDF डाउनलोड करें
        </Button>

        <div className="text-xs text-gray-600 bg-blue-50 rounded-lg p-3">
          <p className="font-medium mb-1">ध्यान दें:</p>
          <ul className="space-y-1">
            <li>• सुधारी गई PDF में मूल फॉर्मेटिंग संरक्षित रखी गई है</li>
            <li>• व्याकरण और वर्तनी की त्रुटियां सुधारी गई हैं</li>
            <li>• विराम चिह्न और वाक्य संरचना में सुधार किया गया है</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrectedPDFViewer;
