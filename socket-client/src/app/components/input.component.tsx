"use client";

import { InputHTMLAttributes } from "react";

type InputProps = Partial<InputHTMLAttributes<HTMLInputElement>>;

export default function Input(props: InputProps) {
  return (
    <input
      type="text"
      className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-green-600"
      {...props}
    />
  );
}
