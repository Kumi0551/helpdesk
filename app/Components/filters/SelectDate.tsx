import React from "react";

interface SelectDateProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  min?: string;
  disabled?: boolean;
}

const SelectDate: React.FC<SelectDateProps> = ({
  value,
  onChange,
  label,
  min,
  disabled,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        disabled={disabled}
        className="border border-gray-300 rounded-md p-2 focus:outline-none "
      />
    </div>
  );
};

export default SelectDate;
