
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard } from 'lucide-react';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useAuth } from '@/components/AuthProvider';
import type { WordCreditPlan } from '@/types/wordPlan';

interface RazorpayPaymentButtonProps {
  wordPlan: WordCreditPlan;
  onPaymentSuccess?: () => void;
}

const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  wordPlan,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { initiateRazorpayPayment, isLoading } = useRazorpayPayment();
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });

  const totalAmount = wordPlan.price_before_gst + (wordPlan.price_before_gst * wordPlan.gst_percentage / 100);

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return;
    }

    await initiateRazorpayPayment({
      word_plan_id: wordPlan.id,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
    });

    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  if (wordPlan.plan_type === 'free' || wordPlan.price_before_gst === 0) {
    return (
      <Button className="w-full bg-gray-600 hover:bg-gray-700" disabled>
        साइनअप पर मिलता है
      </Button>
    );
  }

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
        disabled={isLoading}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        ₹{totalAmount.toFixed(2)} में खरीदें
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {wordPlan.plan_name} - ₹{totalAmount.toFixed(2)}
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          {wordPlan.words_included.toLocaleString()} शब्द स्थायी रूप से
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">पूरा नाम</Label>
          <Input
            id="name"
            value={customerDetails.name}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
            placeholder="अपना पूरा नाम दर्ज करें"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">ईमेल</Label>
          <Input
            id="email"
            type="email"
            value={customerDetails.email}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="phone">फोन नंबर</Label>
          <Input
            id="phone"
            type="tel"
            value={customerDetails.phone}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="9876543210"
            required
          />
        </div>

        <div className="pt-4 space-y-2">
          <Button
            onClick={handlePayment}
            disabled={isLoading || !customerDetails.name || !customerDetails.email || !customerDetails.phone}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                भुगतान प्रक्रिया में...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                ₹{totalAmount.toFixed(2)} का भुगतान करें
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="w-full"
            disabled={isLoading}
          >
            रद्द करें
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPaymentButton;
