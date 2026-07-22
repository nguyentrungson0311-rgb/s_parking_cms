import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md  px-2.5 py-1.5 text-md font-medium leading-none",
  {
    variants: {
      variant: {
        success: "bg-badge-success-bg text-badge-success-fg",
        warning: "bg-badge-warning-bg text-badge-warning-fg",
        danger: "bg-badge-danger-bg text-badge-danger-fg",
        info: "bg-badge-info-bg text-badge-info-fg",
        neutral: "bg-badge-neutral-bg text-badge-neutral-fg",
        disabled: "bg-badge-disabled-bg text-badge-disabled-fg",
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
