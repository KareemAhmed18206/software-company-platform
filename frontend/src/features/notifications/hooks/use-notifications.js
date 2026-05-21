"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { apiRequest } from "@/lib/api/client";
import { useSocket } from "@/features/messaging/hooks/use-socket";

export function useNotifications() {
  const { token, isAuthenticated } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const response = await apiRequest("/notifications", { token });
    setNotifications(response.notifications);
    setUnreadCount(response.unreadCount);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!isAuthenticated || !token) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await apiRequest("/notifications", { token });

        if (!isMounted) {
          return;
        }

        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleNewNotification = (notification) => {
      setNotifications((current) => [notification, ...current]);
      setUnreadCount((current) => current + 1);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket]);

  const markAllRead = async () => {
    if (!token) {
      return;
    }

    await apiRequest("/notifications/read-all", {
      method: "PATCH",
      token
    });
    await loadNotifications();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    reloadNotifications: loadNotifications,
    markAllRead
  };
}
