"use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

interface SelectProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options: string[];
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    // Manually trigger react-hook-form's onChange
    const fakeEvent = {
      target: { name: id, value },
    };
    register(id).onChange(fakeEvent);
  };

  return (
    <div className="w-full relative" ref={selectRef}>
      {/*  <label
        htmlFor={id}
        className={`absolute cursor-text text-md duration-150 transform -translate-y-3 top-1 z-10 origin-[0] left-4 ${
          selectedValue ? "scale-75 -translate-y-4" : ""
        }`}
      >
        {label}
      </label> */}

      <div
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={` 
          peer
          w-full
          p-4
          pt-6
          outline-none
          bg-white
          font-light
          border-2
          rounded-md
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          cursor-pointer
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
          ${disabled ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {selectedValue ? selectedValue.replace("_", " ") : `Select ${label}`}
      </div>

      <input
        type="hidden"
        {...register(id, { required })}
        value={selectedValue}
      />

      {isOpen && (
        <div
          className="
          absolute
          z-50
          w-full
          mt-1
          bg-white
          border-2
          border-slate-300
          rounded-md
          shadow-lg
          max-h-60
          overflow-auto
        "
        >
          <ul>
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="
                  px-4
                  py-2
                  hover:bg-slate-100
                  cursor-pointer
                  transition
                "
              >
                {option.replace("_", " ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{label} is required</p>
      )}
    </div>
  );
};

export default Select;
