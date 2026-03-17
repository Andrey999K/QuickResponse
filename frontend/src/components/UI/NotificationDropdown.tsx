"use client";

import { Bell, CheckCircle, Delete, Inbox } from "@deemlol/next-icons";
import { Avatar, Button, Dropdown, Empty, List, MenuProps, Spin, Tooltip } from "antd";
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
  const { notifications, isLoading } = useNotifications(10);
  const { unreadCount, mutate: mutateUnread } = useUnreadNotifications();
  const { markNotificationAsRead } = useMarkNotificationAsRead();
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead();
  const { deleteNotification } = useDeleteNotification();

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    mutateUnread();
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
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
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <span className="font-medium">Уведомления</span>
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
              image={<Inbox size={48} className="text-gray-300" />}
              className="py-8"
            />
          ) : (
            <List
              dataSource={notifications}
              renderItem={(notification) => (
                <List.Item
                  className={`cursor-pointer hover:bg-gray-50 ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  actions={[
                    <Tooltip key="delete" title="Удалить">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<Delete size={14} />}
                        onClick={(e) => handleDelete(e, notification.id)}
                      />
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={40}
                        style={{
                          backgroundColor: notification.is_read
                            ? "#d9d9d9"
                            : "#1890ff",
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            !notification.is_read ? "font-semibold" : ""
                          }
                        >
                          {notification.title}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    }
                    description={
                      <>
                        <div className="text-sm">{notification.message}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {dayjs(notification.created_at).fromNow()}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
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
      dropdownRender={(menu) => (
        <div className="w-[380px] bg-white rounded-lg shadow-lg border border-gray-100">
          {menu}
        </div>
      )}
      overlayClassName="notification-dropdown"
    >
      {children}
    </Dropdown>
  );
};
