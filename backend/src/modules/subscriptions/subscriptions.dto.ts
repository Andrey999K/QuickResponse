import { z } from "zod";

export const activateSubscriptionDto = z.object({
  tier_id: z.number().int().positive("Tier ID must be positive"),
  payment_id: z.string().optional(),
});

export const cancelSubscriptionDto = z.object({
  reason: z.string().optional(),
});
