export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      cashfree_orders: {
        Row: {
          created_at: string | null
          customer_details: Json
          id: string
          order_amount: number
          order_currency: string | null
          order_id: string
          order_meta: Json | null
          order_status: string | null
          order_tags: Json | null
          payment_session_id: string | null
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
          order_tags?: Json | null
          payment_session_id?: string | null
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
          order_tags?: Json | null
          payment_session_id?: string | null
          updated_at?: string | null
          user_id?: string
          word_plan_id?: string | null
          words_to_credit?: number
        }
        Relationships: [
          {
            foreignKeyName: "cashfree_orders_word_plan_id_fkey"
            columns: ["word_plan_id"]
            isOneToOne: false
            referencedRelation: "word_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      cashfree_webhook_logs: {
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
          id: string
          name: string | null
          phone: string | null
          preferred_language: Database["public"]["Enums"]["app_language"] | null
          privacy_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          email_preferences?: Json | null
          id: string
          name?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["app_language"]
            | null
          privacy_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          email_preferences?: Json | null
          id?: string
          name?: string | null
          phone?: string | null
          preferred_language?:
            | Database["public"]["Enums"]["app_language"]
            | null
          privacy_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
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
          billing_cycle: string
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          razorpay_subscription_id: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          razorpay_subscription_id?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          razorpay_subscription_id?: string | null
          started_at?: string
          status?: string
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
          expiry_date: string | null
          id: string
          is_free_credit: boolean | null
          purchase_date: string | null
          updated_at: string
          user_id: string
          words_available: number
          words_purchased: number
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_free_credit?: boolean | null
          purchase_date?: string | null
          updated_at?: string
          user_id: string
          words_available?: number
          words_purchased?: number
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_free_credit?: boolean | null
          purchase_date?: string | null
          updated_at?: string
          user_id?: string
          words_available?: number
          words_purchased?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_word_credits_profiles"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      word_plans: {
        Row: {
          created_at: string
          gst_percentage: number
          id: string
          is_active: boolean
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
      admin_analytics_summary: {
        Row: {
          active_subscriptions: number | null
          corrections_this_month: number | null
          corrections_this_week: number | null
          corrections_today: number | null
          revenue_this_month: number | null
          total_revenue: number | null
          total_users: number | null
          users_this_month: number | null
          users_this_week: number | null
          users_today: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
          next_expiry_date: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
