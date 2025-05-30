
export interface UserWithDetails {
  id: string;
  name?: string;
  email: string;
  created_at: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  last_login?: string;
  is_active: boolean;
  role: string;
  profile_completion: number;
  word_balance: {
    total_words_available: number;
    free_words: number;
    purchased_words: number;
    next_expiry_date?: string;
  };
  usage_stats: {
    total_corrections: number;
    words_used_today: number;
    words_used_this_month: number;
  };
}

export interface UserFilters {
  search: string;
  role: string;
  activity_status: string;
  word_balance_range: string;
  profile_completion: string;
  date_range: string;
  sort_by: string;
  sort_order: string;
}
