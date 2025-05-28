
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { PDFProcessingStatus } from '@/types/pdf';

interface PDFProcessorProps {
  status: PDFProcessingStatus;
  onProcess: () => void;
  onReset: () => void;
  canProcess: boolean;
}

const PDFProcessor: React.FC<PDFProcessorProps> = ({
  status,
  onProcess,
  onReset,
  canProcess
}) => {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'idle':
        return <Play className="h-5 w-5 text-blue-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'idle':
        return 'प्रक्रिया शुरू करने के लिए तैयार';
      case 'uploading':
        return 'PDF अपलोड हो रही है...';
      case 'extracting':
        return 'PDF से टेक्स्ट निकाला जा रहा है...';
      case 'correcting':
        return 'व्याकरण सुधार हो रहा है...';
      case 'generating':
        return 'सुधारी गई PDF तैयार की जा रही है...';
      case 'completed':
        return 'प्रक्रिया सफलतापूर्वक पूर्ण हुई!';
      case 'error':
        return 'त्रुटि हुई है';
      default:
        return status.message || 'प्रक्रिया जारी है...';
    }
  };

  const getProgressColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const isProcessing = ['uploading', 'extracting', 'correcting', 'generating'].includes(status.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>प्रक्रिया की स्थिति</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{getStatusText()}</span>
            <span>{status.progress}%</span>
          </div>
          <Progress 
            value={status.progress} 
            className="h-2"
          />
        </div>

        {status.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{status.error}</p>
          </div>
        )}

        {status.message && status.status !== 'error' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">{status.message}</p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={onProcess}
            disabled={!canProcess || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                प्रक्रिया जारी है...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                प्रक्रिया शुरू करें
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={onReset}
            disabled={isProcessing}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            रीसेट करें
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFProcessor;
