"use client";

import { useState, useEffect } from "react";
import { Input } from "./Input";

type Props = {
  name: string;
  label?: string;
  defaultValue?: number | string;
  placeholder?: string;
  required?: boolean;
};

function formatWithDots(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function NumberInput({ name, label, defaultValue, placeholder, required }: Props) {
  const initial = defaultValue ? String(defaultValue) : "";
  const [raw, setRaw] = useState(() => initial.replace(/\D/g, ""));
  const [display, setDisplay] = useState(() => formatWithDots(initial));

  useEffect(() => {
    setDisplay(formatWithDots(raw));
  }, [raw]);

  return (
    <div>
      <Input
        label={label}
        value={display}
        onChange={(e: any) => {
          const v = e.target.value;
          const digits = v.replace(/\D/g, "");
          setRaw(digits);
          setDisplay(formatWithDots(digits));
        }}
        placeholder={placeholder}
        required={required}
      />
      <input type="hidden" name={name} value={raw} />
    </div>
  );
}

export default NumberInput;
