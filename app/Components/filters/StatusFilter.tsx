"use client";

import { FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Status } from "@prisma/client";

interface StatusFilterProps {
  value: Status | "all";
  onChange: (value: Status | "all") => void;
}

// Map enum values to display labels
const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: Status.OPEN, label: "Open" },
  { value: Status.PENDING, label: "Pending" },
  { value: Status.IN_PROGRESS, label: "In Progress" },
  { value: Status.RESOLVED, label: "Resolved" },
  { value: Status.CLOSED, label: "Closed" },
] as const;

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get the display label for the current value
  const currentLabel =
    statusOptions.find((opt) => opt.value === value)?.label || "All Statuses";

  return (
    <div className="">
      <h3 className="text-sm font-medium text-slate-700 mb-2">Status</h3>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{currentLabel}</span>
          <FaChevronDown
            className={`h-3 w-3 text-slate-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute
            z-50
            w-full
            mt-1
            bg-white
            border-2
            border-slate-300
            rounded-md
            shadow-lg
            overflow-hidden"
            role="listbox"
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === option.value
                    ? "bg-purple-100 text-purple-900"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusFilter;
