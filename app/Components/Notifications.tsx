"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { Notification } from "@prisma/client";
import Link from "next/link";

const Notifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    // Set up periodic checking every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      const unread = response.data.filter(
        (n: Notification) => !n.isRead
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  return (
    <div className="relative">
      <Link href="/notifications" passHref>
        <div className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <FaBell className="h-6 w-6 text-purple-800" />
          <span
            className={`
            absolute top-0 right-0 
            ${unreadCount > 0 ? "bg-red-500" : "bg-red-400"} 
            text-white text-xs rounded-full 
            h-5 w-5 flex items-center justify-center
          `}
          >
            {unreadCount}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Notifications;
