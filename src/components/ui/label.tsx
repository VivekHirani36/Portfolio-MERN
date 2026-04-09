import React from "react";
import { cn } from "./utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-sm font-medium text-slate-700 dark:text-slate-200", className)}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
