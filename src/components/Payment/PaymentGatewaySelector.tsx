
import React from 'react';
import RazorpayPaymentButton from './RazorpayPaymentButton';
import RecurringSubscriptionButton from './RecurringSubscriptionButton';

interface WordPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
  plan_category?: string;
}

interface PaymentGatewaySelectorProps {
  wordPlan: WordPlan;
  onPaymentSuccess?: () => void;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  wordPlan,
  onPaymentSuccess
}) => {
  // Show recurring subscription button for subscription plans
  if (wordPlan.plan_category === 'subscription') {
    return (
      <RecurringSubscriptionButton 
        wordPlan={wordPlan} 
        onSubscriptionSuccess={onPaymentSuccess} 
      />
    );
  }

  // Show regular payment button for top-up plans
  return (
    <RazorpayPaymentButton 
      wordPlan={wordPlan} 
      onPaymentSuccess={onPaymentSuccess} 
    />
  );
};

export default PaymentGatewaySelector;
