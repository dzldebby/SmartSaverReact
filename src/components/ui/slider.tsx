"use client"

import * as React from "react"

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
  }
>(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValueChange) {
      onValueChange([Number(e.target.value)]);
    }
  };

  return (
    <div
      ref={ref}
      className={`relative w-full touch-none select-none ${className}`}
      {...props}
    >
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="absolute h-full bg-primary"
          style={{
            width: `${((value[0] - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <input
        type="range"
        value={value[0]}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider } 