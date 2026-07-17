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
          "border-transparent bg-[var(--sp-blue)] text-white hover:shadow-[0_10px_18px_rgba(11,92,230,0.16)] hover:bg-[var(--sp-blue-strong)]",
        "outline-primary":
          "border-[var(--sp-blue)] bg-[var(--sp-surface)] text-[var(--sp-blue)] hover:bg-[var(--sp-blue-soft)]",
        plain:
          "border-transparent bg-transparent text-[var(--sp-strong)] hover:bg-[var(--sp-blue-soft)]",
        "outline-plain":
          "border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-strong)] hover:shadow-[var(--shadow-soft)] hover:bg-[var(--sp-blue-soft)]",
        secondary:
          "border-transparent bg-[var(--sp-blue-soft)] text-[var(--sp-blue)] hover:bg-[var(--accent)]",
        "outline-secondary":
          "border-[var(--sp-secondary)] bg-[var(--sp-blue-soft)] text-[var(--sp-blue)] hover:bg-[var(--accent)]",
        "fill-secondary":
          "border-transparent bg-[var(--sp-secondary)] text-white hover:shadow-[0_10px_18px_rgba(78,157,255,0.18)] hover:bg-[#2D85F5]",
        "success-outline":
          "border-[var(--sp-green)] bg-[var(--sp-green-soft)] text-[var(--sp-green)] hover:bg-[var(--sp-green-soft)]",
        "success-fill":
          "border-transparent bg-[var(--sp-green)] text-white hover:shadow-[0_10px_18px_rgba(36,199,142,0.18)] hover:bg-[var(--sp-green-strong)]",
        "danger-outline":
          "border-[var(--destructive)] bg-[var(--sp-red-soft)] text-[var(--destructive)] hover:bg-[var(--sp-red-soft)]",
        "danger-fill":
          "border-transparent bg-[var(--destructive)] text-white hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)] hover:bg-[#D93838]",
        outline:
          "border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-strong)] hover:shadow-[var(--shadow-soft)] hover:bg-[var(--sp-blue-soft)]",
        ghost:
          "border-transparent bg-transparent text-[var(--sp-muted)] hover:bg-[var(--muted)] hover:text-[var(--sp-strong)]",
        danger:
          "border-transparent bg-[var(--destructive)] text-white hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)] hover:bg-[#D93838]",
        disable:
          "border-transparent bg-[var(--sp-grey-soft)] text-[var(--badge-disabled-fg)] shadow-none",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs [&_svg]:size-4",
        md: "h-9 gap-1.5 rounded-[8px] px-3.5 text-sm [&_svg]:size-4",
        lg: "h-10 gap-2 rounded-[9px] px-4 py-2 text-base [&_svg]:size-[18px]",
        icon: "size-9 rounded-[8px] p-0 [&_svg]:size-4",
        "icon-sm": "size-8 rounded-[8px] p-0 [&_svg]:size-4",
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
