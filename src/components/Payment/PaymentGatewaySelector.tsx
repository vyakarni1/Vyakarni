
import React from 'react';
import RazorpayPaymentButton from './RazorpayPaymentButton';
import RazorpaySubscriptionButton from './RazorpaySubscriptionButton';

interface WordPlan {
  id: string;
  plan_name: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
  // Enhanced fields
  plan_type?: string;
  max_words_per_correction?: number;
  max_corrections_per_month?: number;
  max_team_members?: number;
  features?: string[];
}

interface PaymentGatewaySelectorProps {
  wordPlan: WordPlan;
  onPaymentSuccess?: () => void;
  subscriptionMode?: boolean; // New prop to determine payment type
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  wordPlan,
  onPaymentSuccess,
  subscriptionMode = false
}) => {
  // For subscription plans, use subscription payment
  if (subscriptionMode || wordPlan.plan_type === 'basic' || wordPlan.plan_type === 'premium') {
    return <RazorpaySubscriptionButton subscriptionPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
  }

  // For one-time purchases (topup plans), use regular payment
  return <RazorpayPaymentButton wordPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
};

export default PaymentGatewaySelector;
