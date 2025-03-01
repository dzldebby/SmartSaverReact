import React, { forwardRef } from 'react';

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        {...props}
      />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
        {checked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-primary"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox }; 