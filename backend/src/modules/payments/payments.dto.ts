import { z } from "zod";

/**
 * DTO для создания платежа
 */
export const createPaymentDto = z.object({
  tier_id: z.number().int().positive("Tier ID must be positive"),
  user_id: z.number().int().positive("User ID must be positive"),
});

/**
 * DTO для webhook Robokassa (Result URL)
 */
export const robokassaResultDto = z.object({
  InvId: z.string(),
  OutSum: z.string(),
  SignatureValue: z.string(),
  Shp_itemid: z.string().optional(),
  Shp_user_id: z.string().optional(),
});

/**
 * DTO для проверки статуса платежа
 */
export const checkPaymentStatusDto = z.object({
  payment_id: z.string(),
});
