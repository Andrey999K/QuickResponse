"use client";

import { MoreVertical } from "@deemlol/next-icons";
import { Button, Dropdown, MenuProps } from "antd";
import Link from "next/link";

export const UserMenu = () => {
  const handleClick = async () => {
    // await logoutAction();
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
        <Button type="primary" danger onClick={handleClick}>
          Выйти
        </Button>
      ),
      key: "2",
      disabled: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} className="hover:cursor-pointer">
      <MoreVertical size={24} />
    </Dropdown>
  );
};
