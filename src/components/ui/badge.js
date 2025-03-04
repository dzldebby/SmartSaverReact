import React from 'react';

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-primary text-primary-foreground hover:bg-primary/80";
      case "secondary":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/80";
    }
  };

  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getVariantClasses()} ${className}`}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge }; 