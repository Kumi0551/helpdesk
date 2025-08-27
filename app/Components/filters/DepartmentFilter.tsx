"use client";

import { FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

interface DepartmentFilterProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const DepartmentFilter = ({
  options,
  value,
  onChange,
}: DepartmentFilterProps) => {
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
      <h3 className="text-sm font-medium text-slate-700 mb-2">Department</h3>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center gap-x-2 px-4 py-2 mb-3 text-sm text-left bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <span>{value === "all" ? "All Departments" : value}</span>
          <FaChevronDown
            className={`h-3 w-3 text-slate-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-5 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
            <button
              onClick={() => {
                onChange("all");
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                value === "all"
                  ? "bg-purple-100 text-purple-900"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Departments
            </button>
            {options.map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  onChange(dept);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === dept
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
  );
};
