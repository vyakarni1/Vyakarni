
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Settings } from 'lucide-react';
import PaymentDataFixer from './PaymentDataFixer';

const ManualPaymentProcessor = () => {
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleManualFix = async () => {
    if (!orderId.trim()) {
      toast({
        title: "त्रुटि",
        description: "कृपया ऑर्डर ID दर्ज करें",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions
        .invoke('razorpay-payment/manual-fix', {
          body: { order_id: orderId.trim() }
        });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast({
          title: "सफल",
          description: "भुगतान मैन्युअल रूप से प्रोसेस हो गया",
        });
        setOrderId('');
      } else {
        throw new Error(data.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Manual payment processing error:', error);
      toast({
        title: "त्रुटि",
        description: error instanceof Error ? error.message : "मैन्युअल प्रोसेसिंग में त्रुटि हुई",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>मैन्युअल पेमेंट प्रोसेसर</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orderId">Razorpay Order ID</Label>
            <Input
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="order_xxxxxxxxxxxxxx"
            />
          </div>
          
          <Button
            onClick={handleManualFix}
            disabled={isProcessing || !orderId.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                प्रोसेस हो रहा है...
              </>
            ) : (
              'मैन्युअल प्रोसेस करें'
            )}
          </Button>
          
          <p className="text-xs text-gray-600">
            केवल Admin उपयोग के लिए - असफल भुगतान को मैन्युअल रूप से प्रोसेस करने के लिए
          </p>
        </CardContent>
      </Card>

      <PaymentDataFixer />
    </div>
  );
};

export default ManualPaymentProcessor;
