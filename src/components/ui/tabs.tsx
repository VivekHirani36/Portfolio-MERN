import React from "react";
import { cn } from "./utils";

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [value, setValue] = React.useState(defaultValue || "");
  const currentValue = controlledValue !== undefined ? controlledValue : value;

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        onChange: (nextValue: string) => {
          setValue(nextValue);
          onValueChange?.(nextValue);
        },
      }}
    >
      <div className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props} />
  )
);

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) return null;

  const isActive = context.value === value;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500",
        isActive
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        className
      )}
      onClick={() => context.onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) return null;

    return context.value === value ? (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    ) : null;
  }
);

Tabs.displayName = "Tabs";
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
