import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border font-bold outline-none transition-all focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:border-transparent disabled:bg-[var(--sp-grey-soft)] disabled:text-[var(--badge-disabled-fg)] disabled:shadow-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-[var(--sp-theme)] text-[var(--primary-foreground)] hover:shadow-[var(--shadow-brand)] hover:bg-[var(--sp-theme-strong)]",
        "outline-primary":
          "border-[var(--sp-theme)] bg-[var(--sp-surface)] text-[var(--sp-theme)] hover:bg-[var(--sp-theme-soft)]",
        plain:
          "border-transparent bg-transparent text-[var(--sp-strong)] hover:bg-[var(--sp-theme-soft)]",
        "outline-plain":
          "border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-strong)] hover:shadow-[var(--shadow-soft)] hover:bg-[var(--sp-theme-soft)]",
        secondary:
          "border-transparent bg-[var(--sp-theme-soft)] text-[var(--sp-theme)] hover:bg-[var(--accent)]",
        "outline-secondary":
          "border-[var(--sp-secondary)] bg-[var(--sp-theme-soft)] text-[var(--sp-theme)] hover:bg-[var(--accent)]",
        "fill-secondary":
          "border-transparent bg-[var(--sp-secondary)] text-[var(--primary-foreground)] hover:shadow-[var(--shadow-brand)] hover:bg-[var(--sp-theme-strong)]",
        "success-outline":
          "border-[var(--sp-green)] bg-[var(--sp-green-soft)] text-[var(--sp-green)] hover:bg-[var(--sp-green-soft)]",
        "success-fill":
          "border-transparent bg-[var(--sp-green)] text-[var(--sp-success-fill-foreground,var(--primary-foreground))] hover:shadow-[0_10px_18px_rgba(36,199,142,0.18)] hover:bg-[var(--sp-green-strong)]",
        "danger-outline":
          "border-[var(--destructive)] bg-[var(--sp-red-soft)] text-[var(--destructive)] hover:bg-[var(--sp-red-soft)]",
        "danger-fill":
          "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)] hover:bg-[#D93838]",
        outline:
          "border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-strong)] hover:shadow-[var(--shadow-soft)] hover:bg-[var(--sp-theme-soft)]",
        ghost:
          "border-transparent bg-transparent text-[var(--sp-muted)] hover:bg-[var(--muted)] hover:text-[var(--sp-strong)]",
        danger:
          "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)] hover:bg-[#D93838]",
        disable:
          "border-transparent bg-[var(--sp-grey-soft)] text-[var(--badge-disabled-fg)] shadow-none",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs [&_svg]:size-4",
        md: "h-9 gap-1.5 rounded-[8px] px-3.5 text-sm [&_svg]:size-4",
        lg: "h-10 gap-2 rounded-[9px] px-4 py-2 text-base [&_svg]:size-[18px]",
        icon: "size-9 rounded-[8px] p-0 [&_svg]:size-4",
        "icon-sm": "size-8 rounded-[10px] p-0 [&_svg]:size-4",
        "icon-lg": "size-12 rounded-[8px] p-0 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
