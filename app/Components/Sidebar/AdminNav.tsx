"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTicket } from "react-icons/fa6";

interface AdminNavProps {
  onItemClick: () => void;
}

const sidebarSuperAdminItems = [
  {
    href: "/dashboard/department-tickets",
    icon: FaTicket,
    label: "Department Tickets",
  },
];

const AdminNav: React.FC<AdminNavProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  return (
    <>
      {sidebarSuperAdminItems.map((item) => (
        <Link key={item.href} href={item.href} passHref onClick={onItemClick}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={`w-full justify-start p-3 my-2 text-xl ${
              pathname === item.href
                ? "bg-cyan-400 text-white border-none font-semibold"
                : "text-gray-800 hover:bg-gray-200 border-none font-semibold"
            }`}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5 lg:h-7 lg:w-7" />
              <span className="text-base">{item.label}</span>
            </div>
          </Button>
        </Link>
      ))}
    </>
  );
};

export default AdminNav;
