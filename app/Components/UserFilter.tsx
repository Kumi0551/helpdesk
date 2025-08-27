"use client";

import { FaChevronDown, FaFilter } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Role } from "@prisma/client";

interface UserFilterProps {
  departmentOptions: string[];
  onFilterChange: (
    department: string,
    role: Role | "all",
    hasTickets: "all" | "created" | "assigned" | "none"
  ) => void;
}

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

const ticketOptions = [
  { value: "all", label: "All Users" },
  { value: "created", label: "Has Created Tickets" },
  { value: "assigned", label: "Has Assigned Tickets" },
  { value: "none", label: "No Ticket Activity" },
];

export const UserFilter = ({
  departmentOptions,
  onFilterChange,
}: UserFilterProps) => {
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState<Role | "all">("all");
  const [ticketFilter, setTicketFilter] = useState<
    "all" | "created" | "assigned" | "none"
  >("all");

  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  const deptRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
      }
      if (
        ticketRef.current &&
        !ticketRef.current.contains(event.target as Node)
      ) {
        setIsTicketOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(department, role, ticketFilter);
  }, [department, role, ticketFilter, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <FaFilter className="text-purple-800" />
          Filter Users
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Department
            </h3>
            <div className="relative" ref={deptRef}>
              <button
                type="button"
                onClick={() => setIsDeptOpen(!isDeptOpen)}
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>
                  {department === "all" ? "All Departments" : department}
                </span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isDeptOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isDeptOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  <button
                    onClick={() => {
                      setDepartment("all");
                      setIsDeptOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      department === "all"
                        ? "bg-purple-100 text-purple-900"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Departments
                  </button>
                  {departmentOptions.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setDepartment(dept);
                        setIsDeptOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        department === dept
                          ? "bg-purple-100 text-purple-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Role</h3>
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>{role === "all" ? "All Roles" : role}</span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isRoleOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isRoleOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setRole(option.value as Role | "all");
                        setIsRoleOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        role === option.value
                          ? "bg-purple-100 text-purple-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Activity Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Ticket Activity
            </h3>
            <div className="relative" ref={ticketRef}>
              <button
                type="button"
                onClick={() => setIsTicketOpen(!isTicketOpen)}
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>
                  {ticketOptions.find((o) => o.value === ticketFilter)?.label}
                </span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isTicketOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isTicketOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  {ticketOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTicketFilter(
                          option.value as
                            | "all"
                            | "created"
                            | "assigned"
                            | "none"
                        );
                        setIsTicketOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        ticketFilter === option.value
                          ? "bg-purple-100 text-purple-900"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
