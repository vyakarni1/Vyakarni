
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone } from 'lucide-react';
import CashfreePaymentButton from './CashfreePaymentButton';
import RazorpayPaymentButton from './RazorpayPaymentButton';

interface WordPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
}

interface PaymentGatewaySelectorProps {
  wordPlan: WordPlan;
  onPaymentSuccess?: () => void;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  wordPlan,
  onPaymentSuccess
}) => {
  const [selectedGateway, setSelectedGateway] = useState<'cashfree' | 'razorpay' | null>(null);
  const totalAmount = wordPlan.price_before_gst + (wordPlan.price_before_gst * wordPlan.gst_percentage / 100);

  if (!selectedGateway) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {wordPlan.plan_name} - ₹{totalAmount.toFixed(2)}
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            भुगतान विधि चुनें
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={selectedGateway || ''} onValueChange={(value) => setSelectedGateway(value as 'cashfree' | 'razorpay')}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="cashfree" id="cashfree" />
              <Label htmlFor="cashfree" className="flex items-center space-x-3 cursor-pointer flex-1">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Cashfree</div>
                  <div className="text-sm text-gray-500">क्रेडिट/डेबिट कार्ड, UPI, नेट बैंकिंग</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="razorpay" id="razorpay" />
              <Label htmlFor="razorpay" className="flex items-center space-x-3 cursor-pointer flex-1">
                <div className="bg-green-100 p-2 rounded-full">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Razorpay</div>
                  <div className="text-sm text-gray-500">सभी भुगतान विधियां उपलब्ध</div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={() => {
              if (selectedGateway) {
                // This will cause re-render with selected gateway
              }
            }}
            disabled={!selectedGateway}
            className="w-full"
          >
            आगे बढ़ें
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Render the selected payment gateway component
  if (selectedGateway === 'cashfree') {
    return <CashfreePaymentButton wordPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
  }

  if (selectedGateway === 'razorpay') {
    return <RazorpayPaymentButton wordPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
  }

  return null;
};

export default PaymentGatewaySelector;
