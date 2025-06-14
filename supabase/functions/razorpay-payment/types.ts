
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, any>
  created_at: number
}

export interface RazorpayPayment {
  id: string
  entity: string
  amount: number
  currency: string
  status: string
  order_id: string
  invoice_id?: string
  international?: boolean
  method: string
  amount_refunded: number
  refund_status?: string
  captured: boolean
  description?: string
  card_id?: string
  bank?: string
  wallet?: string
  vpa?: string
  email: string
  contact: string
  notes: Record<string, any>
  fee?: number
  tax?: number
  error_code?: string
  error_description?: string
  error_source?: string
  error_step?: string
  error_reason?: string
  acquirer_data?: Record<string, any>
  created_at: number
}

export interface CreateOrderRequest {
  word_plan_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
}

export interface RazorpayWebhookEvent {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: RazorpayPayment
    }
    order?: {
      entity: RazorpayOrder
    }
  }
  created_at: number
}
