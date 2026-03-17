"use client";

import { Bell, CheckCircle, Delete, Inbox } from "@deemlol/next-icons";
import { Avatar, Button, Dropdown, Empty, MenuProps, Spin, Tooltip } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ReactNode } from "react";

import {
  INotification,
  NotificationType,
} from "@/types/Notification";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useDeleteNotification,
  useNotifications,
  useUnreadNotifications,
} from "@/hooks/useNotificationApi";

dayjs.extend(relativeTime);

interface NotificationDropdownProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationDropdown = ({
  children,
  open,
  onOpenChange,
}: NotificationDropdownProps) => {
  const { notifications, isLoading, mutate, error } = useNotifications(10, 0);
  const { unreadCount, mutate: mutateUnread } = useUnreadNotifications();
  const { markNotificationAsRead } = useMarkNotificationAsRead();
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead();
  const { deleteNotification } = useDeleteNotification();

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      // Обновляем локально кэш после клика
      mutate();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    mutateUnread();
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    // Обновляем локально кэш после удаления
    mutate();
    mutateUnread();
  };

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, ReactNode> = {
      vacancy: <Bell size={16} />,
      info: <Bell size={16} />,
      success: <CheckCircle size={16} />,
      warning: <Bell size={16} />,
    };
    return icons[type] || <Bell size={16} />;
  };

  const getNotificationColor = (type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      vacancy: "blue",
      info: "default",
      success: "green",
      warning: "orange",
    };
    return colors[type] || "default";
  };

  const items: MenuProps["items"] = [
    {
      key: "header",
      label: (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
          <span className="font-medium text-gray-900 dark:text-white">Уведомления</span>
          {unreadCount > 0 && (
            <Button
              type="link"
              size="small"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Прочитать все
            </Button>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      key: "list",
      label: (
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : notifications.length === 0 ? (
            <Empty
              description="Нет уведомлений"
              image={<Inbox size={48} className="text-gray-300 dark:text-gray-600" />}
              className="py-8"
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.is_read ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-900"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: notification.is_read
                        ? "#d9d9d9"
                        : "#1890ff",
                    }}
                    className="flex-shrink-0"
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm ${
                          !notification.is_read ? "font-semibold" : ""
                        } text-gray-900 dark:text-white`}
                      >
                        {notification.title}
                      </span>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{notification.message}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {dayjs(notification.created_at).fromNow()}
                    </div>
                  </div>
                  <Tooltip title="Удалить">
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<Delete size={14} />}
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="flex-shrink-0"
                    />
                  </Tooltip>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      open={open}
      onOpenChange={onOpenChange}
      popupRender={(menu) => (
        <div className="w-[380px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
          {menu}
        </div>
      )}
      classNames={{
        root: "notification-dropdown",
      }}
    >
      {children}
    </Dropdown>
  );
};
