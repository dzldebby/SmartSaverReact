"use client"

import * as React from "react"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, onCheckedChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        ref={ref}
        className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${className}`}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox } 