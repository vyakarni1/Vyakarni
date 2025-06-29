
import React from 'react';
import RazorpayPaymentButton from './RazorpayPaymentButton';
import type { WordCreditPlan } from '@/types/wordPlan';

interface PaymentGatewaySelectorProps {
  wordPlan: WordCreditPlan;
  onPaymentSuccess?: () => void;
}

const PaymentGatewaySelector: React.FC<PaymentGatewaySelectorProps> = ({
  wordPlan,
  onPaymentSuccess
}) => {
  // All plans use the same one-time payment system
  return <RazorpayPaymentButton wordPlan={wordPlan} onPaymentSuccess={onPaymentSuccess} />;
};

export default PaymentGatewaySelector;
