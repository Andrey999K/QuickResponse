"use client";

import { MoreVertical } from "@deemlol/next-icons";
import { Button, Dropdown, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";

export const UserMenu = () => {
  const router = useRouter();

  const handleLogout = () => {
    apiClient
      .post("/api/auth/logout")
      .finally(() => router.push("/login"));
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={{ pathname: "/dashboard/profile" }}>Профиль</Link>,
      key: "0",
    },
    {
      label: <Link href={{ pathname: "/dashboard/settings" }}>Настройки</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Button type="primary" danger onClick={handleLogout}>
          Выйти
        </Button>
      ),
      key: "2",
    },
  ];

  return (
    <div className="cursor-pointer">
      <Dropdown menu={{ items }}>
        <MoreVertical size={24} />
      </Dropdown>
    </div>
  );
};