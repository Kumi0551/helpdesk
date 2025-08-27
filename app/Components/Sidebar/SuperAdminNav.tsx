"use client";

import { Button } from "@relume_io/relume-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface SuperAdminNavProps {
  onItemClick: () => void;
}

const sidebarSuperAdminItems = [
  { href: "/admin/users", label: "Manage Users" },
  { href: "/admin/tickets", label: "All Tickets" },
  {
    href: "/admin/departments",
    label: "Departments",
  },
  { href: "/admin/reports", label: "Report" },
];

const SuperAdminNav: React.FC<SuperAdminNavProps> = ({ onItemClick }) => {
  const pathname = usePathname();
  return (
    <>
      {sidebarSuperAdminItems.map((item) => (
        <Link key={item.href} href={item.href} passHref onClick={onItemClick}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={`w-full justify-start p-2 mb-3  ${
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

export default SuperAdminNav;
