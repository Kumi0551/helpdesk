"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface UserNavItemsProps {
  onItemClick: () => void;
}

const UserSidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/submit-ticket", label: "Submit a ticket" },
  { href: "/tickets", label: "Tickets" },
  {
    href: "/dashboard/department-tickets",

    label: "Department Tickets",
  },
];

const UserNavItems: React.FC<UserNavItemsProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  return (
    <>
      {UserSidebarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          passHref
          className="cursor-pointer"
          onClick={() => {
            onItemClick();
          }}
        >
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={`w-full justify-start p-2 mb-3 ${
              pathname === item.href
                ? "bg-cyan-400 text-white border-none "
                : "text-gray-800 hover:bg-gray-200 border-none "
            }`}
          >
            <div className="flex items-center">
              <span className="text-base">{item.label}</span>
            </div>
          </Button>
        </Link>
      ))}
    </>
  );
};

export default UserNavItems;
