
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { errorLogger } from '@/services/ErrorLogger';

interface ErrorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: Error;
  errorId?: string;
  context?: Record<string, any>;
}

interface ErrorReport {
  userDescription: string;
  userEmail: string;
  reproductionSteps: string;
  expectedBehavior: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  isOpen,
  onClose,
  error,
  errorId,
  context,
}) => {
  const [report, setReport] = useState<ErrorReport>({
    userDescription: '',
    userEmail: '',
    reproductionSteps: '',
    expectedBehavior: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Collect comprehensive error information
      const errorReport = {
        ...report,
        errorId,
        errorMessage: error?.message,
        errorStack: error?.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        browserInfo: {
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
        },
        screenInfo: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
        },
        viewportInfo: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
        },
        recentErrors: errorLogger.getRecentErrors(5),
        errorStats: errorLogger.getErrorStats(),
      };

      // In a real implementation, send this to your backend
      console.log('Error Report:', errorReport);
      
      // Store in localStorage for now
      const existingReports = JSON.parse(localStorage.getItem('error_reports') || '[]');
      existingReports.push(errorReport);
      localStorage.setItem('error_reports', JSON.stringify(existingReports));

      // Log successful report submission
      errorLogger.logError(new Error('Error report submitted'), {
        severity: 'low',
        category: 'system',
        context: {
          reportId: `report_${Date.now()}`,
          originalErrorId: errorId,
        },
      });

      setIsSubmitted(true);
      toast.success('त्रुटि रिपोर्ट सफलतापूर्वक भेजी गयी!');
      
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setReport({
          userDescription: '',
          userEmail: '',
          reproductionSteps: '',
          expectedBehavior: '',
          priority: 'medium',
        });
      }, 2000);
    } catch (submitError) {
      console.error('Failed to submit error report:', submitError);
      toast.error('रिपोर्ट भेजने में समस्या हुयी। कृपया कुछ समय के उपरांत प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setIsSubmitted(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center p-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">रिपोर्ट भेजी गई!</h3>
            <p className="text-gray-600">
              आपकी त्रुटि रिपोर्ट सफलतापूर्वक भेजी गयी है। हम शीघ्र ही इसकी जाँच करेंगे।
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            त्रुटि रिपोर्ट भेजें
          </DialogTitle>
          <DialogDescription>
            कृपया त्रुटि के विषय में विस्तार से बतायें जिससे हम इसे शीघ्र सुधार सकें।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userDescription">समस्या का विवरण *</Label>
            <Textarea
              id="userDescription"
              value={report.userDescription}
              onChange={(e) => setReport(prev => ({ ...prev, userDescription: e.target.value }))}
              placeholder="कृपया बतायें कि क्या समस्या हुयी और आप क्या करने का प्रयत्न कर रहे थे..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reproductionSteps">समस्या को दोहराने के चरण</Label>
            <Textarea
              id="reproductionSteps"
              value={report.reproductionSteps}
              onChange={(e) => setReport(prev => ({ ...prev, reproductionSteps: e.target.value }))}
              placeholder="1. पहले मैंने... 
2. फिर मैंने...
3. तब यह त्रुटि हुई..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedBehavior">अपेक्षित व्यवहार</Label>
            <Textarea
              id="expectedBehavior"
              value={report.expectedBehavior}
              onChange={(e) => setReport(prev => ({ ...prev, expectedBehavior: e.target.value }))}
              placeholder="आप क्या होने की उम्मीद कर रहे थे?"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userEmail">ईमेल (वैकल्पिक)</Label>
            <Input
              id="userEmail"
              type="email"
              value={report.userEmail}
              onChange={(e) => setReport(prev => ({ ...prev, userEmail: e.target.value }))}
              placeholder="आपका ईमेल पता (अपडेट के लिए)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">प्राथमिकता</Label>
            <select
              id="priority"
              value={report.priority}
              onChange={(e) => setReport(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">कम - छोटी समस्या</option>
              <option value="medium">मध्यम - सामान्य समस्या</option>
              <option value="high">उच्च - महत्वपूर्ण कार्य प्रभावित</option>
              <option value="critical">गंभीर - ऐप काम नहीं कर रहा</option>
            </select>
          </div>

          {error && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">तकनीकी जानकारी:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>त्रुटि:</strong> {error.message}</div>
                {errorId && <div><strong>त्रुटि ID:</strong> {errorId}</div>}
                <div><strong>पृष्ठ:</strong> {window.location.pathname}</div>
                <div><strong>समय:</strong> {new Date().toLocaleString('hi-IN')}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              निरस्त करें
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !report.userDescription.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Send className="h-4 w-4 mr-2 animate-pulse" />
                  भेजा जा रहा है...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  रिपोर्ट भेजें
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorReportModal;
