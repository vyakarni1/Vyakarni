
// Unified interface for word credit plans
export interface WordCreditPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  words_included: number;
  price_before_gst: number;
  gst_percentage: number;
  plan_category?: string;
  // Enhanced fields for display
  max_words_per_correction?: number;
  max_corrections_per_month?: number;
  max_team_members?: number;
  features?: string[];
}

// Simple payment data interface
export interface PaymentData {
  word_plan_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}
