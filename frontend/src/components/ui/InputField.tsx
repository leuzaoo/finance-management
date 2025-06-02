import { ReactNode, InputHTMLAttributes } from "react";

import React from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  image?: ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({ placeholder, type, image, value, onChange }: Props) {
  return (
    <div className="relative flex w-full min-w-xs flex-col items-center">
      <input
        onChange={onChange}
        value={value}
        autoComplete="off"
        type={type}
        placeholder={placeholder}
        className={`bg-dark-light border-light/10 text-light w-full rounded-md border py-2 pl-2 shadow-sm outline-none ${image && "pl-10"}`}
      />
      {image && (
        <span className="absolute top-1/2 left-2 size-5 -translate-y-1/2 opacity-50">
          {image}
        </span>
      )}
    </div>
  );
}

export default InputField;
