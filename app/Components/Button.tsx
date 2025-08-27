"use client";

import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "outline" | "success" | "disabled";
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  outline,
  small,
  custom,
  onClick,
  variant = "primary",
}) => {
  // Base classes that apply to all buttons
  const baseClasses = `
    disabled:opacity-70
    disabled:cursor-not-allowed
    rounded-md
    hover:opacity-80
    transition
    w-full
    flex
    items-center
    justify-center
    gap-2
    p-2
    border-[1px]
    ${small ? "text-sm font-light" : "text-md font-medium"}
    ${custom ? custom : ""}
  `;

  // Variant-specific classes
  const getVariantClasses = () => {
    if (outline) {
      return "bg-white text-purple-800 border-purple-800";
    }

    switch (variant) {
      case "primary":
        return "bg-purple-800 text-white border-purple-800";
      case "success":
        return "bg-green-600 text-white border-green-600";
      case "disabled":
        return "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed";
      case "outline": // Fallback if outline prop is used
      default:
        return "bg-white text-purple-800 border-purple-800";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || variant === "disabled"}
      className={`${baseClasses} ${getVariantClasses()}`}
    >
      {label}
    </button>
  );
};

export default Button;
