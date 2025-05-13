import React from "react";

type Props = {
  label: string;
  type: string;
  placeholder: string;
};

function InputField({ label, placeholder, type }: Props) {
  return (
    <div className="flex flex-col w-full min-w-xs">
      <label className="text-lg font-light">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-light w-full py-2 text-lg text-dark pl-2 rounded-md outline-none placeholder:text-base"
      />
    </div>
  );
}

export default InputField;
