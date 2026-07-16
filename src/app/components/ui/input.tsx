import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-md border border-[var(--input)] bg-white px-4 text-base text-[var(--sp-text)] outline-none transition placeholder:text-[var(--sp-subtle)] focus:border-[var(--sp-blue)]/60 focus:ring-4 focus:ring-primary/10",
        className,
      )}
      {...props}
    />
  );
}

export function SearchInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#6B7280]" />
      <Input className="pl-[52px]" {...props} />
    </div>
  );
}
