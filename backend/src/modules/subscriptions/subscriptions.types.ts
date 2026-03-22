export interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  check_interval: number;
  telegram_enabled: boolean;
  ai_enabled: boolean;
  custom_prompt_enabled: boolean;
  description: string | null;
  max_searches: number;
  max_auto_ai_per_day: number;
  max_manual_ai: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  tier_id: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithSubscription {
  id: number;
  email: string;
  username: string;
  subscription_tier_id: number;
  tier?: SubscriptionTier;
}
