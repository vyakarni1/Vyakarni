
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { fixPaymentDataInconsistencies, processUnprocessedPayments } from '@/utils/fixPaymentData';

const PaymentDataFixer = () => {
  const [isFixingData, setIsFixingData] = useState(false);
  const [isProcessingPayments, setIsProcessingPayments] = useState(false);
  const { toast } = useToast();

  const handleFixDataInconsistencies = async () => {
    setIsFixingData(true);
    
    try {
      const result = await fixPaymentDataInconsistencies();
      
      if (result.success) {
        toast({
          title: "डेटा सुधार सफल",
          description: `${result.ordersFixed} ऑर्डर्स को ठीक किया गया`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Data fix error:', error);
      toast({
        title: "डेटा सुधार में त्रुटि",
        description: error instanceof Error ? error.message : "अज्ञात त्रुटि",
        variant: "destructive",
      });
    } finally {
      setIsFixingData(false);
    }
  };

  const handleProcessUnprocessedPayments = async () => {
    setIsProcessingPayments(true);
    
    try {
      const result = await processUnprocessedPayments();
      
      if (result.success) {
        const successCount = result.results?.filter(r => r.success).length || 0;
        const failCount = result.results?.filter(r => !r.success).length || 0;
        
        toast({
          title: "पेमेंट प्रोसेसिंग सफल",
          description: `${successCount} पेमेंट्स सफल, ${failCount} असफल`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "पेमेंट प्रोसेसिंग में त्रुटि",
        description: error instanceof Error ? error.message : "अज्ञात त्रुटि",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayments(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>पेमेंट डेटा सुधारक</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">डेटा असंगति सुधारें</h3>
            <p className="text-sm text-gray-600">
              गुम word_plan_id वाले ऑर्डर्स को ठीक करें
            </p>
            <Button
              onClick={handleFixDataInconsistencies}
              disabled={isFixingData}
              className="w-full"
            >
              {isFixingData ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  सुधार रहे हैं...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  डेटा सुधारें
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">अनप्रोसेसड पेमेंट्स प्रोसेस करें</h3>
            <p className="text-sm text-gray-600">
              सफल लेकिन अनप्रोसेसड पेमेंट्स को मैन्युअल रूप से प्रोसेस करें
            </p>
            <Button
              onClick={handleProcessUnprocessedPayments}
              disabled={isProcessingPayments}
              className="w-full"
              variant="outline"
            >
              {isProcessingPayments ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  प्रोसेस कर रहे हैं...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  अनप्रोसेसड पेमेंट्स प्रोसेस करें
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDataFixer;
