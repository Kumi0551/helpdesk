"use client";

import { FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Priority } from "@prisma/client";

interface PriorityFilterProps {
  value: Priority | "all";
  onChange: (value: Priority | "all") => void;
}

const options = [
  { value: "all", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const PriorityFilter: React.FC<PriorityFilterProps> = ({ value, onChange }) => {
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

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-2">Priority</h3>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center gap-x-2 px-4 py-2 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none"
        >
          <span>{value === "all" ? "All Priorities" : value}</span>
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
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value as Priority | "all");
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === option.value
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
  );
};

export default PriorityFilter;
