import { ReactNode, InputHTMLAttributes } from "react";

import React from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  image?: ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function InputField({
  placeholder,
  type,
  image,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="relative flex w-full flex-col items-center">
      <input
        onChange={onChange}
        value={value}
        autoComplete="off"
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-md border border-dark/20 py-2 pl-2 text-dark shadow-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-light/10 dark:bg-dark-light dark:text-white ${image && "pl-10"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      />
      {image && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50">
          {image}
        </span>
      )}
    </div>
  );
}

export default InputField;
