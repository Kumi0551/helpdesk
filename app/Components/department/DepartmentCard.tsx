"use client";

import { Department } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { FaUsers, FaEdit, FaTrash } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { TiTicket } from "react-icons/ti";

interface DepartmentCardProps {
  department: Department & {
    _count: {
      users: number;
      tickets: number;
    };
    tickets: {
      createdAt: Date;
    }[];
  };
  currentUserRole?: string;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  currentUserRole,
}) => {
  const newestTicketDate =
    department.tickets.length > 0
      ? new Date(
          Math.max(
            ...department.tickets.map((t) => new Date(t.createdAt).getTime())
          )
        )
      : null;

  return (
    <Link href={`/admin/departments/${department.id}`} className="block">
      <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow hover:border-purple-800 border border-transparent">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {department.name}
              </h3>
              <p className="text-sm text-slate-500">
                Created: {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>

            {currentUserRole === "SUPER_ADMIN" && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle edit
                  }}
                  className="p-2 text-purple-800 hover:text-purple-900 hover:bg-indigo-50 rounded-full"
                  aria-label="Edit department"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle delete
                  }}
                  className="p-2 text-rose-800 hover:text-rose-900 hover:bg-rose-50 rounded-full"
                  aria-label="Delete department"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <StatItem
              icon={<FaUsers className="text-purple-800" size={20} />}
              label="Members"
              value={department._count.users}
            />

            <StatItem
              icon={<TiTicket className="text-purple-600" size={20} />}
              label="Tickets"
              value={department._count.tickets}
            />
          </div>

          {newestTicketDate && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
              <FiClock size={16} />
              <span>
                Last activity: {newestTicketDate.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const StatItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="flex items-center space-x-2">
    {icon}
    <div className="flex items-center justify-center gap-2">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  </div>
);

export default DepartmentCard;
