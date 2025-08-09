# Vyakarni API Reference

Complete API documentation for Vyakarni's Supabase Edge Functions and external integrations.

## Table of Contents

1. [Authentication](#authentication)
2. [Grammar Checking APIs](#grammar-checking-apis)
3. [Dictionary APIs](#dictionary-apis)
4. [Payment APIs](#payment-apis)
5. [User Management APIs](#user-management-apis)
6. [Email APIs](#email-apis)
7. [External APIs](#external-apis)
8. [Error Handling](#error-handling)

## Authentication

All API endpoints require authentication unless specified otherwise. Vyakarni uses Supabase Auth with JWT tokens.

### Authentication Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
apikey: <supabase_anon_key>
```

### Getting Authentication Token

```typescript
// Client-side authentication
const { data: { user }, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Token is automatically included in subsequent requests
const { data, error } = await supabase.functions.invoke('function-name');
```

## Grammar Checking APIs

### Basic Grammar Check

**Endpoint**: `grammar-check`  
**Method**: POST  
**Authentication**: Required

Performs basic grammar checking using OpenAI API.

#### Request Body

```typescript
interface GrammarCheckRequest {
  text: string;           // Text to check (max 10,000 characters)
  options?: {
    checkSpelling?: boolean;    // Default: true
    checkGrammar?: boolean;     // Default: true
    includeReasons?: boolean;   // Default: true
  };
}
```

#### Response

```typescript
interface GrammarCheckResponse {
  correctedText: string;
  corrections: Correction[];
  originalText: string;
  processingTime: number;
  wordCount: number;
}

interface Correction {
  incorrect: string;
  correct: string;
  reason: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax';
  source: 'gpt';
  position?: {
    start: number;
    end: number;
  };
}
```

#### Example

```typescript
const { data, error } = await supabase.functions.invoke('grammar-check', {
  body: {
    text: "यह एक गलत वाक्य हैं।",
    options: {
      checkSpelling: true,
      checkGrammar: true,
      includeReasons: true
    }
  }
});

// Response
{
  "correctedText": "यह एक गलत वाक्य है।",
  "corrections": [
    {
      "incorrect": "हैं",
      "correct": "है", 
      "reason": "एकवचन कर्ता के साथ एकवचन क्रिया का प्रयोग होगा",
      "type": "grammar",
      "source": "gpt",
      "position": { "start": 15, "end": 17 }
    }
  ],
  "originalText": "यह एक गलत वाक्य हैं।",
  "processingTime": 1250,
  "wordCount": 5
}
```

### Advanced Grammar Check (Grok AI)

**Endpoint**: `grok-grammar-check`  
**Method**: POST  
**Authentication**: Required

Advanced grammar checking using Grok AI for better accuracy.

#### Request Body

```typescript
interface GrokGrammarRequest {
  text: string;
  enhancedProcessing?: boolean;  // Default: false
}
```

#### Response

```typescript
interface GrokGrammarResponse {
  correctedText: string;
  corrections: Correction[];
  confidence: number;            // Overall confidence score (0-1)
  suggestions: string[];         // Additional suggestions
  processingTime: number;
}
```

#### Example

```typescript
const { data, error } = await supabase.functions.invoke('grok-grammar-check', {
  body: {
    text: "मैंने कल दिल्ली जाना हैं।",
    enhancedProcessing: true
  }
});
```

### Style Enhancement

**Endpoint**: `grok-style-enhance`  
**Method**: POST  
**Authentication**: Required

Enhances writing style and flow using Grok AI.

#### Request Body

```typescript
interface StyleEnhanceRequest {
  text: string;
  styleType?: 'formal' | 'casual' | 'literary' | 'professional';
  targetAudience?: 'general' | 'academic' | 'business' | 'creative';
}
```

#### Response

```typescript
interface StyleEnhanceResponse {
  enhancedText: string;
  improvements: StyleImprovement[];
  styleScore: number;            // Style quality score (0-100)
  readabilityScore: number;      // Readability score (0-100)
}

interface StyleImprovement {
  original: string;
  improved: string;
  reason: string;
  type: 'vocabulary' | 'flow' | 'clarity' | 'tone';
  impact: 'high' | 'medium' | 'low';
}
```

### Text Comparison

**Endpoint**: `grok-text-comparison`  
**Method**: POST  
**Authentication**: Required

Compares original and processed text to generate highlighting data.

#### Request Body

```typescript
interface TextComparisonRequest {
  originalText: string;
  finalText: string;
  processingType: 'grammar_check' | 'style_enhance';
  textHistoryId?: string;        // Optional: link to text history
}
```

#### Response

```typescript
interface TextComparisonResponse {
  corrections: Correction[];
  statistics: {
    totalChanges: number;
    grammarFixes: number;
    styleFixes: number;
    spellingFixes: number;
  };
  highlightData: HighlightRange[];
}

interface HighlightRange {
  start: number;
  end: number;
  type: string;
  severity: 'error' | 'warning' | 'suggestion';
}
```

## Dictionary APIs

### Apply Dictionary

**Endpoint**: `dictionary-apply`  
**Method**: POST  
**Authentication**: Required

Applies dictionary word replacements to text.

#### Request Body

```typescript
interface DictionaryApplyRequest {
  text: string;
  dictionaryType?: 'grammar' | 'style' | 'both';
  wordReplacements?: WordReplacement[];  // Optional: custom replacements
}

interface WordReplacement {
  original: string;
  replacement: string;
  category?: string;
}
```

#### Response

```typescript
interface DictionaryApplyResponse {
  processedText: string;
  appliedReplacements: AppliedReplacement[];
  totalReplacements: number;
}

interface AppliedReplacement {
  original: string;
  replacement: string;
  occurrences: number;
  positions: number[];
}
```

### Sync Dictionary

**Endpoint**: `sync-dictionary`  
**Method**: POST  
**Authentication**: Admin only

Synchronizes dictionary data from Google Sheets.

#### Request Body

```typescript
interface DictionarySyncRequest {
  sheetId: string;
  dictionaryType: 'grammar' | 'style';
  forceUpdate?: boolean;         // Default: false
}
```

#### Response

```typescript
interface DictionarySyncResponse {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
  lastSyncAt: string;
}
```

## Payment APIs

### Create Payment Order

**Endpoint**: `razorpay-payment`  
**Method**: POST  
**Authentication**: Required

Creates a Razorpay payment order for word credits or subscriptions.

#### Request Body

```typescript
interface PaymentOrderRequest {
  amount: number;                // Amount in INR (paise)
  currency: string;              // Default: 'INR'
  wordPlanId?: string;           // For word credit purchases
  subscriptionPlanId?: string;   // For subscription purchases
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
  };
}
```

#### Response

```typescript
interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;                 // Razorpay key for frontend
  customerDetails: CustomerDetails;
  notes: Record<string, string>;
}
```

#### Example

```typescript
const { data, error } = await supabase.functions.invoke('razorpay-payment', {
  body: {
    amount: 49900,  // ₹499.00 in paise
    currency: 'INR',
    wordPlanId: 'plan_uuid',
    customerDetails: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210'
    }
  }
});
```

### Handle Payment Webhook

**Endpoint**: `razorpay-payment/webhook`  
**Method**: POST  
**Authentication**: None (webhook)

Handles Razorpay payment webhooks for order completion.

#### Webhook Events Handled

- `payment.captured` - Payment successful
- `payment.failed` - Payment failed
- `subscription.charged` - Subscription charged
- `subscription.cancelled` - Subscription cancelled

### Create Subscription

**Endpoint**: `razorpay-payment/subscription`  
**Method**: POST  
**Authentication**: Required

Creates a recurring subscription using Razorpay.

#### Request Body

```typescript
interface CreateSubscriptionRequest {
  planId: string;                // Subscription plan ID
  customerDetails: CustomerDetails;
  addons?: SubscriptionAddon[];
  notes?: Record<string, string>;
}

interface SubscriptionAddon {
  item: {
    name: string;
    amount: number;
    currency: string;
  };
  quantity: number;
}
```

#### Response

```typescript
interface CreateSubscriptionResponse {
  subscriptionId: string;
  shortUrl: string;            // Payment link for customer
  status: string;
  currentStart: number;
  currentEnd: number;
  nextChargeAt: number;
}
```

## User Management APIs

### Get User Profile

**Database Query**: Direct Supabase client call

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select(`
    id, name, email, phone, bio, avatar_url,
    preferred_language, email_preferences, privacy_settings,
    created_at, updated_at
  `)
  .eq('id', userId)
  .single();
```

### Update User Profile

**Database Query**: Direct Supabase client call

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    name: 'Updated Name',
    phone: '+919876543210',
    bio: 'Updated bio',
    preferred_language: 'hindi'
  })
  .eq('id', userId)
  .select()
  .single();
```

### Get Word Balance

**Database Function**: `get_user_word_balance`

```typescript
const { data } = await supabase
  .rpc('get_user_word_balance', { user_uuid: userId });

// Response
{
  "total_words_available": 1500,
  "free_words": 500,
  "purchased_words": 1000,
  "subscription_words": 0,
  "next_expiry_date": null,
  "has_active_subscription": true
}
```

### Get Usage Statistics

**Database Function**: `get_user_stats`

```typescript
const { data } = await supabase
  .rpc('get_user_stats', { user_uuid: userId });

// Response
{
  "total_corrections": 45,
  "corrections_today": 3,
  "corrections_this_week": 12,
  "corrections_this_month": 28
}
```

## Email APIs

### Send Welcome Email

**Endpoint**: `send-welcome-email`  
**Method**: POST  
**Authentication**: Service role

Sends welcome email to new users.

#### Request Body

```typescript
interface WelcomeEmailRequest {
  userId: string;
  userEmail: string;
  userName?: string;
}
```

#### Response

```typescript
interface WelcomeEmailResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}
```

### Send Bulk Welcome Emails

**Endpoint**: `send-bulk-welcome-emails`  
**Method**: POST  
**Authentication**: Admin only

Sends welcome emails to users who haven't received them.

#### Response

```typescript
interface BulkEmailResponse {
  total_processed: number;
  successful: number;
  failed: number;
  details: Array<{
    userId: string;
    email: string;
    status: 'sent' | 'failed';
    error?: string;
  }>;
}
```

## External APIs

### Grok AI API

**Base URL**: `https://api.x.ai/v1`  
**Authentication**: Bearer token

#### Chat Completion

```typescript
const response = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${XAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'grok-beta',
    messages: [
      {
        role: 'system',
        content: 'You are a Hindi grammar expert...'
      },
      {
        role: 'user',
        content: 'Check this text: मैं स्कूल जाता हूँ।'
      }
    ],
    temperature: 0.1,
    max_tokens: 4000,
  }),
});
```

### Razorpay API

**Base URL**: `https://api.razorpay.com/v1`  
**Authentication**: Basic auth (key_id:key_secret)

#### Create Order

```typescript
const order = await fetch('https://api.razorpay.com/v1/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_SECRET_KEY}`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 49900,
    currency: 'INR',
    receipt: 'receipt_001',
    notes: {
      user_id: 'user_uuid',
      word_plan_id: 'plan_uuid'
    }
  }),
});
```

### Google Sheets API

**Base URL**: `https://sheets.googleapis.com/v4`  
**Authentication**: API key

#### Read Spreadsheet Values

```typescript
const response = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${GOOGLE_SHEETS_API_KEY}`
);

const data = await response.json();
const rows = data.values; // Array of arrays
```

### Resend API

**Base URL**: `https://api.resend.com`  
**Authentication**: Bearer token

#### Send Email

```typescript
const email = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Vyakarni <noreply@vyakarni.com>',
    to: ['user@example.com'],
    subject: 'Welcome to Vyakarni',
    html: '<h1>Welcome!</h1><p>Thank you for joining Vyakarni.</p>',
  }),
});
```

## Error Handling

### Standard Error Response

All APIs return errors in a consistent format:

```typescript
interface APIError {
  error: string;             // Error message
  code?: string;             // Error code
  details?: any;             // Additional error details
  timestamp: string;         // ISO timestamp
}
```

### Common Error Codes

#### Authentication Errors
- `AUTH_REQUIRED` - Authentication required
- `INVALID_TOKEN` - Invalid or expired token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions

#### Validation Errors
- `INVALID_INPUT` - Request validation failed
- `TEXT_TOO_LONG` - Text exceeds maximum length
- `MISSING_REQUIRED_FIELD` - Required field missing

#### Business Logic Errors
- `INSUFFICIENT_CREDITS` - Not enough word credits
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `SUBSCRIPTION_REQUIRED` - Premium subscription required

#### External API Errors
- `AI_SERVICE_UNAVAILABLE` - AI service temporarily unavailable
- `PAYMENT_GATEWAY_ERROR` - Payment processing failed
- `EMAIL_DELIVERY_FAILED` - Email could not be sent

### Error Handling Examples

```typescript
// Client-side error handling
try {
  const { data, error } = await supabase.functions.invoke('grammar-check', {
    body: { text: inputText }
  });
  
  if (error) {
    switch (error.code) {
      case 'INSUFFICIENT_CREDITS':
        showUpgradeModal();
        break;
      case 'TEXT_TOO_LONG':
        showError('Text is too long. Please shorten it.');
        break;
      default:
        showError('An error occurred. Please try again.');
    }
    return;
  }
  
  // Handle success
  setCorrections(data.corrections);
} catch (error) {
  console.error('Unexpected error:', error);
  showError('Something went wrong. Please refresh and try again.');
}
```

### Rate Limiting

Most endpoints have rate limits:

- **Grammar checking**: 10 requests per minute per user
- **Payment operations**: 5 requests per minute per user
- **Email operations**: 1 request per minute per user
- **Admin operations**: 100 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1641024000
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

---

For more information or support, contact the development team or refer to the [Developer Guide](./developer-guide.md).