import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://checkout.razorpay.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://*.supabase.co https://api.razorpay.com;
    frame-src 'self' https://api.razorpay.com;
    object-src 'none';
    base-uri 'self';
  `.replace(/\s+/g, ' ').trim(),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

serve(async (req) => {
  // Add security headers to all responses
  const response = new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...SECURITY_HEADERS
    }
  });
  
  return response;
});