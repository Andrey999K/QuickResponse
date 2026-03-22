/**
 * Статусы платежа
 */
export type PaymentStatus = "pending" | "success" | "failed" | "refunded";

/**
 * Интерфейс платежа
 */
export interface Payment {
  id: number;
  user_id: number;
  tier_id: number;
  amount: number;
  status: PaymentStatus;
  robokassa_payment_id: string | null;
  robokassa_inv_id: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Данные для создания платежа
 */
export interface CreatePaymentData {
  user_id: number;
  tier_id: number;
  amount: number;
  email: string;
  description?: string;
}

/**
 * Результат создания платежа
 */
export interface CreatePaymentResult {
  payment_id: number;
  redirect_url: string;
  inv_id: string;
}

/**
 * Webhook данные от Robokassa
 */
export interface RobokassaWebhookData {
  InvId: string;
  OutSum: string;
  SignatureValue: string;
  Status?: string;
  Shp_itemid?: string | undefined;
  Shp_user_id?: string | undefined;
}
