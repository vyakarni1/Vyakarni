
import React from 'react';
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
  return <RazorpayPaymentButton wordPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
};

export default PaymentGatewaySelector;
