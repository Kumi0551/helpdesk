/* "use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options: (string | Option)[];
  isLoading?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  options,
  isLoading,
}) => {
  return (
    <div className="w-full relative">
      <select
        id={id}
        disabled={disabled || isLoading || options.length === 0}
        {...register(id, { required })}
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
          appearance-none
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
        `}
      >
        <option value="" disabled hidden>
          {isLoading ? "Loading..." : `Select ${label}`}
        </option>

        {options.map((option) => {
          if (typeof option === "string") {
            return (
              <option key={option} value={option}>
                {option.replace("_", " ")}
              </option>
            );
          } else {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            );
          }
        })}
      </select>
      <label
        htmlFor={id}
        className="absolute cursor-text text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{label} is required</p>
      )}
    </div>
  );
};

export default SelectField;
 */

/* "use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@relume_io/relume-ui";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options: (string | Option)[];
  isLoading?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  options,
  isLoading,
}) => {
  return (
    <div className="w-full relative">
      <label
        htmlFor={id}
        className="absolute cursor-text text-md duration-150 transform -translate-y-3 top-1 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>

      <Select
        disabled={disabled || isLoading || options.length === 0}
        {...register(id, { required })}
      >
        <SelectTrigger
          className={` 
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
          ${errors[id] ? "border-rose-400" : "border-slate-300"}
          ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"}
        `}
        >
          <SelectValue
            placeholder={isLoading ? "Loading..." : `Select ${label}`}
          />
        </SelectTrigger>
        <SelectContent
          className="w-[var(--radix-select-trigger-width)] min-w-[100%]"
          avoidCollisions={false}
          sideOffset={4}
        >
          {options.map((option) => {
            if (typeof option === "string") {
              return (
                <SelectItem key={option} value={option}>
                  {option.replace("_", " ")}
                </SelectItem>
              );
            } else {
              return (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              );
            }
          })}
        </SelectContent>
      </Select>

      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{label} is required</p>
      )}
    </div>
  );
};

export default SelectField; */

"use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  options: (string | Option)[];
  isLoading?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  errors,
  options,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Scroll to selected item when dropdown opens
  useEffect(() => {
    if (isOpen && dropdownRef.current && selectedValue) {
      const selectedItem = dropdownRef.current.querySelector(
        '[data-selected="true"]'
      );
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, selectedValue]);

  const handleSelect = (value: string, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    setIsOpen(false);
    // Manually trigger react-hook-form's onChange
    const fakeEvent = {
      target: { name: id, value },
    };
    register(id).onChange(fakeEvent);
  };

  return (
    <div className="w-full relative" ref={selectRef}>
      {/* <label
        htmlFor={id}
        className={`absolute cursor-text text-md duration-150 transform -translate-y-3 top-1 z-10 origin-[0] left-4 ${
          selectedValue ? "scale-75 -translate-y-4" : ""
        }`}
      >
        {label}
      </label> */}
      {/* Custom select trigger */}
      <div
        id={id}
        onClick={() =>
          !disabled && !isLoading && options.length > 0 && setIsOpen(!isOpen)
        }
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
          ${
            disabled || isLoading || options.length === 0
              ? "opacity-70 cursor-not-allowed"
              : ""
          }
        `}
      >
        {isLoading
          ? "Loading..."
          : selectedValue
          ? selectedLabel
          : `Select ${label}`}
      </div>

      <input
        type="hidden"
        {...register(id, { required })}
        value={selectedValue}
      />

      {isOpen && !isLoading && options.length > 0 && (
        <div
          ref={dropdownRef}
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
            overflow-hidden
          "
        >
          <ul className="max-h-32 overflow-y-auto">
            {options.map((option) => {
              if (typeof option === "string") {
                const isSelected = selectedValue === option;
                return (
                  <li
                    key={option}
                    onClick={() =>
                      handleSelect(option, option.replace("_", " "))
                    }
                    data-selected={isSelected}
                    className={`
                      px-4
                      py-2
                      hover:bg-slate-100
                      cursor-pointer
                      transition
                      ${isSelected ? "bg-slate-100 font-medium" : ""}
                    `}
                  >
                    {option.replace("_", " ")}
                  </li>
                );
              } else {
                const isSelected = selectedValue === option.id;
                return (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option.id, option.name)}
                    data-selected={isSelected}
                    className={`
                      px-4
                      py-2
                      hover:bg-slate-100
                      cursor-pointer
                      transition
                      ${isSelected ? "bg-slate-100 font-medium" : ""}
                    `}
                  >
                    {option.name}
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}

      {errors[id] && (
        <p className="text-red-500 text-sm mt-1">{label} is required</p>
      )}
    </div>
  );
};

export default SelectField;
