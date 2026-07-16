import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md  px-2.5 py-1.5 text-md font-medium leading-none",
  {
    variants: {
      variant: {
        success: "bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]",
        warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]",
        danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)]",
        info: "bg-[var(--badge-info-bg)] text-[var(--badge-info-fg)]",
        neutral: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]",
        disabled: "bg-[var(--badge-disabled-bg)] text-[var(--badge-disabled-fg)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export function Badge({
  className,
  variant,
  children,
}: React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
