"use client";

import React, { useState } from "react";
import { SearchForm } from "@/components/UI/SearchForm";
import { UpgradeSubscriptionModal } from "@/components/UI/UpgradeSubscriptionModal";
import { currencies } from "@/utils/currencies";
import { employments, experiences, schedules } from "@/utils/dictionaries";
import { areasMock } from "@/utils/areas";
import { useMySubscription } from "@/hooks/useSubscription";

export default function CreateSearchPage() {
  const { subscription, isLoading: subLoading } = useMySubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSearchLimitExceeded = () => {
    setShowUpgradeModal(true);
  };

  if (subLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <div className="flex flex-col h-full max-w-full w-full">
        <div className="shrink-0">
          <h2 className="font-bold text-2xl text-gray-900 dark:text-white">
            Создание поиска
          </h2>
        </div>
        <div className="mt-6 flex flex-col gap-5 w-full max-w-full overflow-y-auto min-h-0 pb-4 scrollbar-hidden">
          <div className="max-w-3xl">
            <SearchForm
              currencies={currencies}
              schedules={schedules}
              employment={employments}
              experiences={experiences}
              areas={areasMock.data.map((area) => ({ label: area.name, value: area.id }))}
              mode="create"
              onSearchLimitExceeded={handleSearchLimitExceeded}
            />
          </div>
        </div>
      </div>

      <UpgradeSubscriptionModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="search_limit"
        currentTier={subscription?.tier.name}
      />
    </>
  );
}