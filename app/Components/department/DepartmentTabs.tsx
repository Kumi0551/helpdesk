"use client";

import { useState } from "react";
import UserTable from "./UserTable";
import TicketTable from "./TicketTable";
import { Role, Ticket } from "@prisma/client";

interface DepartmentTabsProps {
  department: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      role: Role;
      createdAt: Date;
      updatedAt: Date;
      emailVerified: Date | null;
      hashedPassword: string | null;
      departmentId: string;
    }[];
    tickets: Ticket[];
  };
}

const DepartmentTabs: React.FC<DepartmentTabsProps> = ({ department }) => {
  const [activeTab, setActiveTab] = useState<"users" | "tickets">("users");

  return (
    <div className="mt-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "users"
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Users ({department.users.length})
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tickets"
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tickets ({department.tickets.length})
          </button>
        </nav>
      </div>

      <div className="py-6">
        {activeTab === "users" ? (
          <UserTable users={department.users} />
        ) : (
          <TicketTable tickets={department.tickets} />
        )}
      </div>
    </div>
  );
};

export default DepartmentTabs;
