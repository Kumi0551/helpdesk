"use client";

import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  min?: string;
  icon?: React.ReactNode;
  validationRules?: Record<string, unknown>;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
  icon,
  validationRules = {},
}) => {
  return (
    <div className="w-full relative">
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required, ...validationRules })}
        placeholder=""
        type={type}
        className={` 
        peer
        w-full
        p-3
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
         ${errors[id] ? "focus:border-rose-400" : "focus:border-slate-300"} `}
      />
      {icon && (
        <div className="absolute top-5 right-4 cursor-pointer">{icon}</div>
      )}
      <label
        htmlFor={id}
        className="absolute cursor-text text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
