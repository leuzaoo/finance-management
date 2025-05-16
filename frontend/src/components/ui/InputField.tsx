import { ReactNode, InputHTMLAttributes } from "react";

import React from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder: string;
  image: ReactNode;
}

function InputField({ placeholder, type, image }: Props) {
  return (
    <div className="relative flex w-full min-w-xs flex-col items-center">
      <input
        type={type}
        placeholder={placeholder}
        className="bg-dark-light border-light/10 text-light w-full rounded-md border py-2 pl-10 shadow-sm outline-none"
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
