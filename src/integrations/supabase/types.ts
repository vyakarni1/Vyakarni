export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_drafts: {
        Row: {
          admin_id: string
          created_at: string | null
          draft_key: string
          draft_type: string
          form_data: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          draft_key: string
          draft_type: string
          form_data?: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          draft_key?: string
          draft_type?: string
          form_data?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      analytics_cache: {
        Row: {
          cache_data: Json
          cache_key: string
          created_at: string | null
          expires_at: string
          id: string
        }
        Insert: {
          cache_data: Json
          cache_key: string
          created_at?: string | null
          expires_at: string
          id?: string
        }
        Update: {
          cache_data?: Json
          cache_key?: string
          created_at?: string | null
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          id: string
          ip_address: unknown | null
          post_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          post_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          post_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          comment_count: number
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          like_count: number
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          category_id?: string | null
          comment_count?: number
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          like_count?: number
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          category_id?: string | null
          comment_count?: number
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          like_count?: number
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_blog_posts_author_id"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          handled_by: string | null
          id: string
          message: string
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          handled_by?: string | null
          id?: string
          message: string
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          handled_by?: string | null
          id?: string
          message?: string
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dictionary_sync_status: {
        Row: {
          created_at: string | null
          dictionary_type: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          sync_status: string | null
          total_records: number | null
        }
        Insert: {
          created_at?: string | null
          dictionary_type?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          sync_status?: string | null
          total_records?: number | null
        }
        Update: {
          created_at?: string | null
          dictionary_type?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          sync_status?: string | null
          total_records?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          resend_id: string | null
          sent_at: string | null
          status: string
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          subject: string
          template_name: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject: string
          template_name: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string
          template_name?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      enterprise_inquiries: {
        Row: {
          company_name: string
          company_size: string | null
          contact_person: string
          created_at: string
          email: string
          estimated_users: number | null
          id: string
          industry: string | null
          message: string | null
          phone: string | null
          requirements: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          company_size?: string | null
          contact_person: string
          created_at?: string
          email: string
          estimated_users?: number | null
          id?: string
          industry?: string | null
          message?: string | null
          phone?: string | null
          requirements?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          company_size?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          estimated_users?: number | null
          id?: string
          industry?: string | null
          message?: string | null
          phone?: string | null
          requirements?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          cashfree_order_id: string | null
          cashfree_payment_id: string | null
          created_at: string
          currency: string
          id: string
          payment_gateway: string | null
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_gateway?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status: string
          subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_gateway?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_transactions_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          email_preferences: Json | null
          email_verification_completed_at: string | null
          id: string
          name: string | null
          phone: string | null
          preferred_language: Database["public"]["Enums"]["app_language"] | null
          privacy_settings: Json | null
          updated_at: string | null
          welcome_email_sent_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          email_preferences?: Json | null
          email_verification_completed_at?: string | null
          id: string
          name?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["app_language"]
            | null
          privacy_settings?: Json | null
          updated_at?: string | null
          welcome_email_sent_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          email_preferences?: Json | null
          email_verification_completed_at?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["app_language"]
            | null
          privacy_settings?: Json | null
          updated_at?: string | null
          welcome_email_sent_at?: string | null
        }
        Relationships: []
      }
      razorpay_orders: {
        Row: {
          created_at: string | null
          customer_details: Json
          id: string
          order_amount: number
          order_currency: string | null
          order_id: string
          order_meta: Json | null
          order_status: string | null
          updated_at: string | null
          user_id: string
          word_plan_id: string | null
          words_to_credit: number
        }
        Insert: {
          created_at?: string | null
          customer_details: Json
          id?: string
          order_amount: number
          order_currency?: string | null
          order_id: string
          order_meta?: Json | null
          order_status?: string | null
          updated_at?: string | null
          user_id: string
          word_plan_id?: string | null
          words_to_credit: number
        }
        Update: {
          created_at?: string | null
          customer_details?: Json
          id?: string
          order_amount?: number
          order_currency?: string | null
          order_id?: string
          order_meta?: Json | null
          order_status?: string | null
          updated_at?: string | null
          user_id?: string
          word_plan_id?: string | null
          words_to_credit?: number
        }
        Relationships: []
      }
      razorpay_webhook_logs: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          order_id: string | null
          payment_id: string | null
          processed: boolean | null
          signature: string | null
          webhook_data: Json
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          order_id?: string | null
          payment_id?: string | null
          processed?: boolean | null
          signature?: string | null
          webhook_data: Json
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          order_id?: string | null
          payment_id?: string | null
          processed?: boolean | null
          signature?: string | null
          webhook_data?: Json
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_charges: {
        Row: {
          amount: number
          charge_date: string
          created_at: string
          currency: string | null
          error_code: string | null
          error_description: string | null
          failure_reason: string | null
          id: string
          mandate_id: string | null
          notes: Json | null
          paid_at: string | null
          razorpay_invoice_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          charge_date: string
          created_at?: string
          currency?: string | null
          error_code?: string | null
          error_description?: string | null
          failure_reason?: string | null
          id?: string
          mandate_id?: string | null
          notes?: Json | null
          paid_at?: string | null
          razorpay_invoice_id?: string | null
          razorpay_payment_id?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          charge_date?: string
          created_at?: string
          currency?: string | null
          error_code?: string | null
          error_description?: string | null
          failure_reason?: string | null
          id?: string
          mandate_id?: string | null
          notes?: Json | null
          paid_at?: string | null
          razorpay_invoice_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_charges_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "subscription_mandates"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_mandates: {
        Row: {
          auth_type: string | null
          created_at: string
          current_end: string | null
          current_start: string | null
          customer_notify: boolean | null
          end_date: string | null
          frequency: string | null
          id: string
          mandate_id: string | null
          mandate_status: string | null
          mandate_type: string | null
          max_amount: number
          next_charge_at: string | null
          notes: Json | null
          paid_count: number | null
          razorpay_plan_id: string
          razorpay_subscription_id: string | null
          remaining_count: number | null
          start_date: string
          status: string | null
          subscription_id: string | null
          total_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_type?: string | null
          created_at?: string
          current_end?: string | null
          current_start?: string | null
          customer_notify?: boolean | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          mandate_id?: string | null
          mandate_status?: string | null
          mandate_type?: string | null
          max_amount: number
          next_charge_at?: string | null
          notes?: Json | null
          paid_count?: number | null
          razorpay_plan_id: string
          razorpay_subscription_id?: string | null
          remaining_count?: number | null
          start_date: string
          status?: string | null
          subscription_id?: string | null
          total_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_type?: string | null
          created_at?: string
          current_end?: string | null
          current_start?: string | null
          customer_notify?: boolean | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          mandate_id?: string | null
          mandate_status?: string | null
          mandate_type?: string | null
          max_amount?: number
          next_charge_at?: string | null
          notes?: Json | null
          paid_count?: number | null
          razorpay_plan_id?: string
          razorpay_subscription_id?: string | null
          remaining_count?: number | null
          start_date?: string
          status?: string | null
          subscription_id?: string | null
          total_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_mandates_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json | null
          id: string
          is_active: boolean
          max_corrections_per_month: number
          max_team_members: number
          max_words_per_correction: number
          plan_name: string
          plan_type: string
          price_monthly: number
          price_yearly: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_corrections_per_month?: number
          max_team_members?: number
          max_words_per_correction?: number
          plan_name: string
          plan_type: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean
          max_corrections_per_month?: number
          max_team_members?: number
          max_words_per_correction?: number
          plan_name?: string
          plan_type?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Relationships: []
      }
      system_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_type?: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      text_corrections: {
        Row: {
          corrected_text: string
          corrections_data: Json | null
          created_at: string
          id: string
          original_text: string
          processing_type: string
          updated_at: string
          user_id: string
          words_used: number
        }
        Insert: {
          corrected_text: string
          corrections_data?: Json | null
          created_at?: string
          id?: string
          original_text: string
          processing_type: string
          updated_at?: string
          user_id: string
          words_used?: number
        }
        Update: {
          corrected_text?: string
          corrections_data?: Json | null
          created_at?: string
          id?: string
          original_text?: string
          processing_type?: string
          updated_at?: string
          user_id?: string
          words_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_text_corrections_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_login_activity: {
        Row: {
          created_at: string | null
          device_info: Json | null
          id: string
          ip_address: unknown | null
          location_info: Json | null
          login_time: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          location_info?: Json | null
          login_time?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: Json | null
          id?: string
          ip_address?: unknown | null
          location_info?: Json | null
          login_time?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_login_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_status: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_status?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_status?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_notifications_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          auto_renewal: boolean | null
          billing_cycle: string
          charge_at_cycle: number | null
          created_at: string
          expires_at: string | null
          grace_period_days: number | null
          id: string
          is_recurring: boolean | null
          last_charge_attempt: string | null
          mandate_id: string | null
          next_billing_date: string | null
          plan_id: string
          razorpay_subscription_id: string | null
          retry_attempts: number | null
          started_at: string
          status: string
          subscription_notes: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renewal?: boolean | null
          billing_cycle?: string
          charge_at_cycle?: number | null
          created_at?: string
          expires_at?: string | null
          grace_period_days?: number | null
          id?: string
          is_recurring?: boolean | null
          last_charge_attempt?: string | null
          mandate_id?: string | null
          next_billing_date?: string | null
          plan_id: string
          razorpay_subscription_id?: string | null
          retry_attempts?: number | null
          started_at?: string
          status?: string
          subscription_notes?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renewal?: boolean | null
          billing_cycle?: string
          charge_at_cycle?: number | null
          created_at?: string
          expires_at?: string | null
          grace_period_days?: number | null
          id?: string
          is_recurring?: boolean | null
          last_charge_attempt?: string | null
          mandate_id?: string | null
          next_billing_date?: string | null
          plan_id?: string
          razorpay_subscription_id?: string | null
          retry_attempts?: number | null
          started_at?: string
          status?: string
          subscription_notes?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_subscriptions_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "subscription_mandates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_usage: {
        Row: {
          action_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_usage_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_word_credits: {
        Row: {
          created_at: string
          credit_type: string | null
          expiry_date: string | null
          id: string
          is_free_credit: boolean | null
          purchase_date: string | null
          related_subscription_id: string | null
          updated_at: string
          user_id: string
          words_available: number
          words_purchased: number
        }
        Insert: {
          created_at?: string
          credit_type?: string | null
          expiry_date?: string | null
          id?: string
          is_free_credit?: boolean | null
          purchase_date?: string | null
          related_subscription_id?: string | null
          updated_at?: string
          user_id: string
          words_available?: number
          words_purchased?: number
        }
        Update: {
          created_at?: string
          credit_type?: string | null
          expiry_date?: string | null
          id?: string
          is_free_credit?: boolean | null
          purchase_date?: string | null
          related_subscription_id?: string | null
          updated_at?: string
          user_id?: string
          words_available?: number
          words_purchased?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_word_credits_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_credits_related_subscription_id_fkey"
            columns: ["related_subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      word_dictionary: {
        Row: {
          created_at: string | null
          dictionary_type: string
          id: string
          is_active: boolean | null
          original: string
          replacement: string
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dictionary_type?: string
          id?: string
          is_active?: boolean | null
          original: string
          replacement: string
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dictionary_type?: string
          id?: string
          is_active?: boolean | null
          original?: string
          replacement?: string
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      word_plans: {
        Row: {
          created_at: string
          gst_percentage: number
          id: string
          is_active: boolean
          plan_category: string | null
          plan_name: string
          plan_type: string
          price_before_gst: number
          words_included: number
        }
        Insert: {
          created_at?: string
          gst_percentage?: number
          id?: string
          is_active?: boolean
          plan_category?: string | null
          plan_name: string
          plan_type: string
          price_before_gst?: number
          words_included: number
        }
        Update: {
          created_at?: string
          gst_percentage?: number
          id?: string
          is_active?: boolean
          plan_category?: string | null
          plan_name?: string
          plan_type?: string
          price_before_gst?: number
          words_included?: number
        }
        Relationships: []
      }
      word_purchases: {
        Row: {
          amount_before_gst: number
          created_at: string
          expiry_date: string
          gst_amount: number
          id: string
          purchase_date: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          total_amount: number
          user_id: string
          words_purchased: number
        }
        Insert: {
          amount_before_gst: number
          created_at?: string
          expiry_date: string
          gst_amount: number
          id?: string
          purchase_date?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_amount: number
          user_id: string
          words_purchased: number
        }
        Update: {
          amount_before_gst?: number
          created_at?: string
          expiry_date?: string
          gst_amount?: number
          id?: string
          purchase_date?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          total_amount?: number
          user_id?: string
          words_purchased?: number
        }
        Relationships: []
      }
      word_usage_history: {
        Row: {
          action_type: string
          created_at: string
          id: string
          text_processed: string | null
          user_id: string
          words_used: number
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          text_processed?: string | null
          user_id: string
          words_used: number
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          text_processed?: string | null
          user_id?: string
          words_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_word_usage_history_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_word_credits: {
        Args: {
          p_user_id: string
          p_words_to_add: number
          p_credit_type?: string
          p_expiry_date?: string
        }
        Returns: boolean
      }
      check_user_has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_recurring_subscription: {
        Args: {
          user_uuid: string
          plan_uuid: string
          razorpay_subscription_id: string
          razorpay_plan_id: string
          mandate_details?: Json
        }
        Returns: Json
      }
      create_subscription_for_user: {
        Args: { user_uuid: string; plan_uuid: string }
        Returns: Json
      }
      deduct_words: {
        Args: {
          user_uuid: string
          words_to_deduct: number
          action_type: string
          text_content?: string
        }
        Returns: boolean
      }
      get_admin_analytics_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          users_today: number
          total_users: number
          corrections_this_month: number
          corrections_this_week: number
          corrections_today: number
          revenue_this_month: number
          total_revenue: number
          active_subscriptions: number
          users_this_month: number
          users_this_week: number
        }[]
      }
      get_cached_analytics: {
        Args: { cache_duration_minutes?: number }
        Returns: Json
      }
      get_monthly_usage: {
        Args: { user_uuid: string }
        Returns: {
          corrections_used: number
          words_processed: number
          max_corrections: number
          max_words_per_correction: number
        }[]
      }
      get_settings_by_category: {
        Args: { category_filter?: string }
        Returns: {
          setting_key: string
          setting_value: Json
          setting_type: string
          description: string
          category: string
          is_public: boolean
        }[]
      }
      get_user_active_mandate: {
        Args: { user_uuid: string }
        Returns: {
          mandate_id: string
          razorpay_subscription_id: string
          status: string
          next_charge_at: string
          remaining_count: number
          max_amount: number
        }[]
      }
      get_user_stats: {
        Args: { user_uuid: string }
        Returns: {
          total_corrections: number
          corrections_today: number
          corrections_this_week: number
          corrections_this_month: number
        }[]
      }
      get_user_subscription: {
        Args: { user_uuid: string }
        Returns: {
          subscription_id: string
          plan_name: string
          plan_type: string
          max_words_per_correction: number
          max_corrections_per_month: number
          max_team_members: number
          features: Json
          status: string
          expires_at: string
        }[]
      }
      get_user_word_balance: {
        Args: { user_uuid: string }
        Returns: {
          total_words_available: number
          free_words: number
          purchased_words: number
          topup_words: number
          subscription_words: number
          next_expiry_date: string
          has_active_subscription: boolean
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_blog_post_views: {
        Args: {
          post_uuid: string
          user_uuid?: string
          ip_addr?: unknown
          user_agent_str?: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_admin_id: string
          p_action_type: string
          p_resource_type: string
          p_resource_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: string
      }
      log_sensitive_access: {
        Args: {
          p_user_id: string
          p_action: string
          p_table_name: string
          p_record_id?: string
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      send_bulk_welcome_emails_safe: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      send_welcome_email_safe: {
        Args: { user_uuid: string; user_email: string; user_name?: string }
        Returns: boolean
      }
      toggle_blog_post_like: {
        Args: { post_uuid: string; user_uuid: string }
        Returns: Json
      }
      update_system_setting: {
        Args: { key_name: string; new_value: Json; updated_by?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_language: "hindi" | "english" | "marathi" | "gujarati" | "bengali"
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_language: ["hindi", "english", "marathi", "gujarati", "bengali"],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
