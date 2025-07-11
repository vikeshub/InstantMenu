import * as React from "react";
import { cn } from "../../lib/utils";

export function Select({ value, onValueChange, children, ...props }) {
  return (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      {...props}
      className={"block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-base shadow-sm focus:border-orange-500 focus:ring-orange-500 " + (props.className || "")}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, ...props }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder, children }) {
  return <option value="" disabled>{placeholder}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
