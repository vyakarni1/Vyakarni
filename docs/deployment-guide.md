# Vyakarni Deployment Guide

## Production Deployment

### Prerequisites
- Vercel account for frontend hosting
- Supabase project for backend services
- Domain name and SSL certificate

### Environment Setup
1. **Frontend (Vercel)**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Backend (Supabase Secrets)**
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_key
   supabase secrets set XAI_API_KEY=your_grok_key
   supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key
   supabase secrets set RAZORPAY_SECRET_KEY=your_razorpay_secret
   supabase secrets set RESEND_API_KEY=your_resend_key
   ```

### Deployment Steps
1. **Database Setup**
   ```bash
   supabase db push
   ```

2. **Deploy Functions**
   ```bash
   supabase functions deploy
   ```

3. **Frontend Deployment**
   ```bash
   vercel --prod
   ```

### Monitoring
- Set up Supabase monitoring for database and functions
- Configure Vercel analytics for frontend performance
- Monitor API rate limits and usage

### Backup Strategy
- Automated daily database backups via Supabase
- Regular export of critical data
- Version control for all code changes