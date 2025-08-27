"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Notification } from "@prisma/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Container from "../../Components/Container";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications(true);

    // Set up periodic checking every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications(false);
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (showLoading: boolean) => {
    try {
      if (showLoading) setLoading(true);
      const response = await axios.get("/api/notifications");
      setNotifications(response.data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("/api/notifications/markAllRead");
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.ticketId) {
      router.push(`/tickets/${notification.ticketId}`);
    }
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold ">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm p-2 bg-slate-200 text-purple-600 hover:text-purple-800 cursor-pointer"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-screen overflow-y-auto">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default NotificationsPage;
