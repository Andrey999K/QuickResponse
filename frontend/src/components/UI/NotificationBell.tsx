"use client";

import { Bell } from "@deemlol/next-icons";
import { Badge, Button } from "antd";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

interface NotificationBellProps {
  unreadCount?: number;
}

export const NotificationBell = ({ unreadCount = 0 }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <NotificationDropdown onOpenChange={handleOpenChange} open={open}>
      <Badge count={unreadCount} showZero={false} size="small" offset={[-5, 5]}>
        <Button
          type="text"
          icon={<Bell size={20} />}
          onClick={() => setOpen(!open)}
          className="border-0 hover:bg-gray-100"
        />
      </Badge>
    </NotificationDropdown>
  );
};
