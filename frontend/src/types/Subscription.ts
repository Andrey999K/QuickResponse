export interface ISubscriptionTier {
  id: number;
  name: string;
  price: number;
  check_interval: number;
  telegram_enabled: boolean;
  ai_enabled: boolean;
  custom_prompt_enabled: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ISubscription {
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

export interface ISubscriptionWithTier {
  tier: ISubscriptionTier;
  subscription?: ISubscription;
}

export interface ISubscriptionPermissions {
  canUseTelegram: boolean;
  canUseAI: boolean;
  canUseCustomPrompt: boolean;
  checkInterval: number;
  tierName: string;
}
