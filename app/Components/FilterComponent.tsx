"use client";

import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaChevronDown } from "react-icons/fa";
import { Priority, Status } from "@prisma/client";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterComponentProps {
  departmentOptions: string[];
  onFilterChange: (
    department: string,
    dateRange: string,
    priority: Priority | "all",
    status: Status | "all"
  ) => void;
  initialDepartment?: string;
  initialDateRange?: string;
  initialPriority?: Priority | "all";
  initialStatus?: Status | "all";
}

const dateRangeOptions: FilterOption[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
];

const priorityOptions: FilterOption[] = [
  { value: "all", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const statusOptions: FilterOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "OPEN", label: "Open" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const FilterComponent: React.FC<FilterComponentProps> = ({
  departmentOptions,
  onFilterChange,
  initialDepartment = "all",
  initialDateRange = "all",
  initialPriority = "all",
  initialStatus = "all",
}) => {
  const [departmentFilter, setDepartmentFilter] = useState(initialDepartment);
  const [dateFilter, setDateFilter] = useState(initialDateRange);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">(
    initialPriority
  );
  const [statusFilter, setStatusFilter] = useState<Status | "all">(
    initialStatus
  );

  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDeptDropdownOpen(false);
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(departmentFilter, dateFilter, priorityFilter, statusFilter);
  }, [
    departmentFilter,
    dateFilter,
    priorityFilter,
    statusFilter,
    onFilterChange,
  ]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <FaFilter className="text-purple-800" />
          Filter Tickets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Department Dropdown */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Department
            </h3>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>
                  {departmentFilter === "all"
                    ? "All Departments"
                    : departmentFilter}
                </span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isDeptDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isDeptDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  <button
                    key="all"
                    onClick={() => setDepartmentFilter("all")}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      departmentFilter === "all"
                        ? "bg-purple-100 text-purple-900"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    All Departments
                  </button>
                  {departmentOptions.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setDepartmentFilter(dept)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        departmentFilter === dept
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

          {/* Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
              <FaCalendarAlt className="text-purple-800" />
              Date Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDateFilter(option.value)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    dateFilter === option.value
                      ? "bg-purple-800 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              Priority
            </h3>
            <div className="relative" ref={priorityDropdownRef}>
              <button
                type="button"
                onClick={() =>
                  setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                }
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>
                  {priorityFilter === "all" ? "All Priorities" : priorityFilter}
                </span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isPriorityDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isPriorityDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setPriorityFilter(option.value as Priority | "all");
                        setIsPriorityDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        priorityFilter === option.value
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

          {/* Status Dropdown */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Status</h3>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <span>
                  {statusFilter === "all"
                    ? "All Statuses"
                    : statusFilter.replace("_", " ")}
                </span>
                <FaChevronDown
                  className={`h-3 w-3 text-slate-400 transition-transform ${
                    isStatusDropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value as Status | "all");
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        statusFilter === option.value
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

export default FilterComponent;
