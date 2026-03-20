"use client";

import useSWR from "swr";
import { apiClient } from "@/lib/api-client";
import {
  ISubscriptionTier,
  ISubscriptionWithTier,
  ISubscriptionPermissions,
} from "@/types/Subscription";

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

export async function activateSubscription(tierId: number, paymentId?: string) {
  return apiClient.post("/api/subscriptions/activate", { tier_id: tierId, payment_id: paymentId });
}

export async function cancelSubscription() {
  return apiClient.post("/api/subscriptions/cancel");
}
