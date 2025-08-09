# Vyakarni Database Schema

## Core Tables

### Users & Profiles
- `profiles` - User profile information
- `user_roles` - Role-based access control
- `user_notifications` - User notifications

### Grammar & Text Processing
- `text_corrections` - Grammar checking history
- `word_dictionary` - Word replacement dictionary
- `dictionary_sync_status` - Dictionary synchronization tracking

### Billing & Subscriptions
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User subscription records
- `user_word_credits` - Word credit management
- `payment_transactions` - Payment history
- `razorpay_orders` - Razorpay order tracking

### Content Management
- `blog_posts` - Blog content
- `blog_categories` - Blog categorization
- `contact_submissions` - Contact form submissions

### System Administration
- `admin_audit_logs` - Administrative action logging
- `system_settings` - Application configuration
- `email_logs` - Email delivery tracking

## Key Relationships
- Users have profiles, subscriptions, and word credits
- Text corrections link to users and track word usage
- Payment transactions connect to subscriptions and word purchases
- Blog posts support categories, tags, and user interactions

## Security
- Row Level Security (RLS) enabled on all user data tables
- Admin functions protected by role-based policies
- Audit logging for administrative actions