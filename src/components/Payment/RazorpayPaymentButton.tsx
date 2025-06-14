
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WordPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
}

interface RazorpayPaymentButtonProps {
  wordPlan: WordPlan;
  onPaymentSuccess?: () => void;
}

const RazorpayPaymentButton: React.FC<RazorpayPaymentButtonProps> = ({
  wordPlan,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { initiateRazorpayPayment, isLoading } = useRazorpayPayment();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });

  const totalAmount = wordPlan.price_before_gst + (wordPlan.price_before_gst * wordPlan.gst_percentage / 100);

  const validateForm = () => {
    if (!customerDetails.name.trim()) {
      setError('कृपया अपना नाम दर्ज करें');
      return false;
    }
    if (!customerDetails.email.trim()) {
      setError('कृपया अपना ईमेल दर्ज करें');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      setError('कृपया एक वैध ईमेल दर्ज करें');
      return false;
    }
    if (!customerDetails.phone.trim()) {
      setError('कृपया अपना फोन नंबर दर्ज करें');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(customerDetails.phone.replace(/\s+/g, ''))) {
      setError('कृपया एक वैध फोन नंबर दर्ज करें');
      return false;
    }
    setError(null);
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await initiateRazorpayPayment({
        word_plan_id: wordPlan.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      });

      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('भुगतान प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  };

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
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>{wordPlan.plan_name} - ₹{totalAmount.toFixed(2)}</span>
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          {wordPlan.words_included.toLocaleString()} शब्द
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="name">पूरा नाम *</Label>
          <Input
            id="name"
            value={customerDetails.name}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
            placeholder="अपना पूरा नाम दर्ज करें"
            required
            className={error && !customerDetails.name.trim() ? 'border-red-500' : ''}
          />
        </div>
        
        <div>
          <Label htmlFor="email">ईमेल *</Label>
          <Input
            id="email"
            type="email"
            value={customerDetails.email}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your.email@example.com"
            required
            className={error && !customerDetails.email.trim() ? 'border-red-500' : ''}
          />
        </div>
        
        <div>
          <Label htmlFor="phone">फोन नंबर *</Label>
          <Input
            id="phone"
            type="tel"
            value={customerDetails.phone}
            onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="9876543210"
            required
            className={error && !customerDetails.phone.trim() ? 'border-red-500' : ''}
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
            onClick={() => {
              setShowForm(false);
              setError(null);
            }}
            className="w-full"
            disabled={isLoading}
          >
            रद्द करें
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>सुरक्षित भुगतान Razorpay द्वारा संचालित</p>
          <p>आपकी जानकारी 256-bit SSL एन्क्रिप्शन से सुरक्षित है</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPaymentButton;
