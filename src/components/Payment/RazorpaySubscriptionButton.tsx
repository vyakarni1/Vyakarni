
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, RefreshCw } from 'lucide-react';
import { useRazorpaySubscription } from '@/hooks/useRazorpaySubscription';
import { useAuth } from '@/components/AuthProvider';

interface SubscriptionPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
  plan_type: string;
}

interface RazorpaySubscriptionButtonProps {
  subscriptionPlan: SubscriptionPlan;
  onPaymentSuccess?: () => void;
}

const RazorpaySubscriptionButton: React.FC<RazorpaySubscriptionButtonProps> = ({
  subscriptionPlan,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const { initiateRazorpaySubscription, isLoading } = useRazorpaySubscription();
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });

  const totalAmount = subscriptionPlan.price_before_gst + (subscriptionPlan.price_before_gst * subscriptionPlan.gst_percentage / 100);

  const handleSubscription = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return;
    }

    await initiateRazorpaySubscription({
      plan_id: subscriptionPlan.id,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      notes: {
        plan_name: subscriptionPlan.plan_name,
        plan_type: subscriptionPlan.plan_type,
        words_included: subscriptionPlan.words_included.toString(),
      },
    });

    if (onPaymentSuccess) {
      onPaymentSuccess();
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
        ₹{totalAmount.toFixed(2)}/महीना सब्स्क्राइब करें
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {subscriptionPlan.plan_name} - ₹{totalAmount.toFixed(2)}/महीना
        </CardTitle>
        <p className="text-center text-sm text-gray-600">
          {subscriptionPlan.words_included.toLocaleString()} शब्द प्रति महीना
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
            onClick={handleSubscription}
            disabled={isLoading || !customerDetails.name || !customerDetails.email || !customerDetails.phone}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                सब्स्क्रिप्शन प्रक्रिया में...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                ₹{totalAmount.toFixed(2)}/महीना सब्स्क्राइब करें
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

export default RazorpaySubscriptionButton;
