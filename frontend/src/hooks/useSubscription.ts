"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import { ISubscriptionPermissions, ISubscriptionTier, ISubscriptionWithTier } from "@/types/Subscription";

export interface IPaymentResult {
  redirect_url: string;
  payment_id: number;
  inv_id: string;
}

export interface IPayment {
  id: number;
  user_id: number;
  tier_id: number;
  amount: number;
  status: "pending" | "success" | "failed" | "refunded";
  created_at: string;
}

export interface IAiLimitStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  reason?: string;
}

export interface IAiLimitStatusResponse {
  auto: IAiLimitStatus;
  manual: IAiLimitStatus;
}

export function useTiers() {
  const { data, error, isLoading, mutate } = useSWR<{ tiers: ISubscriptionTier[] }>(
    "/api/subscriptions/tiers",
    {
      fetcher: () => apiClient.get<{ tiers: ISubscriptionTier[] }>("/api/subscriptions/tiers"),
    },
  );

  return {
    tiers: data?.tiers || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useMySubscription() {
  const { data, error, isLoading, mutate } = useSWR<{ subscription: ISubscriptionWithTier }>(
    "/api/subscriptions/my",
    {
      fetcher: () => apiClient.get<{ subscription: ISubscriptionWithTier }>("/api/subscriptions/my"),
    },
  );

  return {
    subscription: data?.subscription,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useSubscriptionPermissions() {
  const { data, error, isLoading, mutate } = useSWR<{ permissions: ISubscriptionPermissions }>(
    "/api/subscriptions/permissions",
    {
      fetcher: () => apiClient.get<{ permissions: ISubscriptionPermissions }>("/api/subscriptions/permissions"),
    },
  );

  return {
    permissions: data?.permissions,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePaymentHistory() {
  const { data, error, isLoading, mutate } = useSWR<{ payments: IPayment[] }>(
    "/api/payments/history",
    {
      fetcher: () => apiClient.get<{ payments: IPayment[] }>("/api/payments/history"),
      shouldRetryOnError: false,
    },
  );

  return {
    payments: data?.payments || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createPayment(tierId: number): Promise<IPaymentResult | null> {
  try {
    console.log(`[Robokassa] Запрос на создание платежа, tierId=${tierId}`);
    const result = await apiClient.post<IPaymentResult>("/api/payments/create", { tier_id: tierId });
    console.log(`[Robokassa] Получен ответ от бэка:`, result);
    return result;
  } catch (error) {
    console.error("[Robokassa] Ошибка создания платежа:", error);
    return null;
  }
}

export async function activateSubscription(tierId: number, paymentId?: string) {
  return apiClient.post("/api/subscriptions/activate", { tier_id: tierId, payment_id: paymentId });
}

export async function cancelSubscription() {
  return apiClient.post("/api/subscriptions/cancel");
}

export function useAiLimitStatus(searchId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<{ data: IAiLimitStatusResponse }>(
    searchId ? `/api/ai/limit-status/${searchId}` : null,
    {
      fetcher: () => apiClient.get<{ data: IAiLimitStatusResponse }>(`/api/ai/limit-status/${searchId}`),
      refreshInterval: 60000, // Обновлять каждые 60 секунд
      shouldRetryOnError: false,
    },
  );

  return {
    auto: data?.data.auto,
    manual: data?.data.manual,
    isLoading,
    isError: error,
    mutate,
  };
}
