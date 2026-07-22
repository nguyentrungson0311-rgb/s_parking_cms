import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap border font-bold outline-none transition-all focus-visible:ring-4 focus-visible:ring-primary/15 disabled:pointer-events-none disabled:border-transparent disabled:bg-grey-soft disabled:text-badge-disabled-fg disabled:shadow-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-theme text-primary-foreground hover:bg-theme-strong hover:shadow-sp-brand",
        "outline-primary":
          "border-theme bg-surface text-theme hover:bg-theme-soft",
        plain:
          "border-transparent bg-transparent text-strong hover:bg-theme-soft",
        "outline-plain":
          "border-border bg-surface text-strong hover:bg-theme-soft hover:shadow-sp-soft",
        secondary:
          "border-transparent bg-theme-soft text-theme hover:bg-accent",
        "outline-secondary":
          "border-secondary bg-theme-soft text-theme hover:bg-accent",
        "fill-secondary":
          "border-transparent bg-secondary text-primary-foreground hover:bg-theme-strong hover:shadow-sp-brand",
        "success-outline":
          "border-green bg-green-soft text-green hover:bg-green-soft",
        "success-fill":
          "border-transparent bg-green text-[var(--sp-success-fill-foreground,var(--primary-foreground))] hover:bg-green-strong hover:shadow-[0_10px_18px_rgba(36,199,142,0.18)]",
        "danger-outline":
          "border-destructive bg-red-soft text-destructive hover:bg-red hover:text-destructive-foreground",
        "danger-fill":
          "border-transparent bg-destructive text-destructive-foreground hover:bg-[#D93838] hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)]",
        outline:
          "border-border bg-surface text-strong hover:bg-theme-soft hover:shadow-sp-soft",
        ghost:
          "border-transparent bg-transparent text-muted hover:bg-badge-neutral-bg hover:text-strong",
        danger:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-[#D93838] hover:shadow-[0_10px_18px_rgba(240,82,82,0.18)]",
        disable:
          "border-transparent bg-grey-soft text-badge-disabled-fg shadow-none",
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
