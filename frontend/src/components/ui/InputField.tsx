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
        className={`w-full rounded-md border border-light/10 bg-dark-light py-2 pl-2 text-light shadow-md outline-none dark:border-light/10 dark:bg-dark-light ${image && "pl-10"} ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-light/20 focus:border-light/20"}`}
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
