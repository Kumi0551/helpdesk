"use client";

import { FaCalendarAlt } from "react-icons/fa";

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
];

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
        <FaCalendarAlt className="text-purple-800" />
        Date Range
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              value === option.value
                ? "bg-purple-800 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
