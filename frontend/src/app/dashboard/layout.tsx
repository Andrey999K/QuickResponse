"use client";

import { ReactNode } from "react";
import { BarChart2, Search, Settings, User } from "@deemlol/next-icons";
import { WalletOutlined, FileTextOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Link from "next/link";

import { Logo } from "@/components/UI/Logo";
import { SidebarLink } from "@/components/UI/SidebarLink";
import { UserMenu } from "@/components/UI/UserMenu";
import { NotificationBell } from "@/components/UI/NotificationBell";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUnreadNotifications } from "@/hooks/useNotificationApi";
import { useSSENotifications } from "@/hooks/useSSENotifications";
import { PageLoader } from "@/components/common/PageLoader";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading } = useCurrentUser();
  const { unreadCount } = useUnreadNotifications();

  // Подключаем SSE для real-time уведомлений
  useSSENotifications(true);

  if (loading) return <PageLoader />;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex gap-2 p-2 h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Сайдбар */}
      <Card className="w-full max-w-xs !bg-gray-50 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700">
        <Logo />
        <ul className="mt-6 text-base flex flex-col gap-6">
          <SidebarLink
            text="Мои поиски"
            url="/dashboard/search"
            icon={<Search size={24} />}
          />
          <SidebarLink
            text="Статистика"
            url="/dashboard/statistics"
            icon={<BarChart2 size={24} />}
          />
          <SidebarLink
            text="Тарифы"
            url="/dashboard/subscriptions"
            icon={<WalletOutlined style={{ fontSize: "24px" }} />}
          />
          <SidebarLink
            text="Платежи"
            url="/dashboard/billing"
            icon={<FileTextOutlined style={{ fontSize: "24px" }} />}
          />
          <SidebarLink
            text="Профиль"
            url="/dashboard/profile"
            icon={<User size={24} />}
          />
          <SidebarLink
            text="Настройки"
            url="/dashboard/settings"
            icon={<Settings size={24} />}
          />
        </ul>
      </Card>

      <div className="flex flex-col gap-2 min-w-0 w-full">
        {/* Хедер */}
        <Card className="w-full !bg-gray-50 dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 flex justify-end">
          <div className="flex gap-2 items-center">
            {/* Уведомления */}
            <NotificationBell unreadCount={unreadCount} />

            <Link
              href={{ pathname: "/dashboard/profile" }}
              className="flex items-center gap-2 !text-black dark:!text-white"
            >
              <div
                className="bg-gray-300 dark:bg-gray-600 flex items-center justify-center rounded-full h-12 w-12 text-xl text-gray-700 dark:text-gray-200">
                {user?.username[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.username}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{user?.email}</span>
              </div>
            </Link>
            <UserMenu />
          </div>
        </Card>

        {/* Контент */}
        <div
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 min-h-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;