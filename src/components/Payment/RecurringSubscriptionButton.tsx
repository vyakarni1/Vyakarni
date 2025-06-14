
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { useRecurringSubscription } from '@/hooks/useRecurringSubscription';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

interface WordPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
}

interface RecurringSubscriptionButtonProps {
  wordPlan: WordPlan;
  onSubscriptionSuccess?: () => void;
}

const RecurringSubscriptionButton: React.FC<RecurringSubscriptionButtonProps> = ({
  wordPlan,
  onSubscriptionSuccess
}) => {
  const { user } = useAuth();
  const { createRecurringSubscription, isLoading } = useRecurringSubscription();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mandateAccepted, setMandateAccepted] = useState(false);
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
    if (!mandateAccepted) {
      setError('कृपया AutoPay सहमति स्वीकार करें');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubscription = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createRecurringSubscription({
        word_plan_id: wordPlan.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      });

      if (onSubscriptionSuccess) {
        onSubscriptionSuccess();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('सब्स्क्रिप्शन प्रक्रिया में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
        disabled={isLoading}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        ₹{totalAmount.toFixed(2)}/माह - AutoPay सब्स्क्रिप्शन
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5" />
          <span>{wordPlan.plan_name} - ₹{totalAmount.toFixed(2)}/माह</span>
        </CardTitle>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {wordPlan.words_included.toLocaleString()} शब्द प्रति माह
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-blue-600">
            <Calendar className="h-3 w-3" />
            <span>AutoPay सक्रिय • मासिक बिलिंग</span>
          </div>
        </div>
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

        {/* AutoPay Mandate Agreement */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="mandate-agreement"
              checked={mandateAccepted}
              onCheckedChange={(checked) => setMandateAccepted(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label htmlFor="mandate-agreement" className="text-sm font-medium cursor-pointer">
                AutoPay सहमति *
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                मैं Razorpay के माध्यम से ₹{totalAmount.toFixed(2)} की मासिक राशि के लिए AutoPay mandate को 
                अधिकृत करता/करती हूं। यह सब्स्क्रिप्शन हर महीने अपने आप नवीनीकृत होगा।
              </p>
              <p className="text-xs text-blue-600 mt-1">
                आप किसी भी समय इसे रद्द कर सकते हैं।
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button
            onClick={handleSubscription}
            disabled={isLoading || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !mandateAccepted}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AutoPay सेटअप हो रहा है...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                ₹{totalAmount.toFixed(2)}/माह AutoPay शुरू करें
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false);
              setError(null);
              setMandateAccepted(false);
            }}
            className="w-full"
            disabled={isLoading}
          >
            रद्द करें
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>सुरक्षित भुगतान Razorpay द्वारा संचालित</p>
          <p>AutoPay mandate e-NACH/UPI के माध्यम से सक्रिय होगा</p>
          <p>256-bit SSL एन्क्रिप्शन से सुरक्षित</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringSubscriptionButton;
