import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type CheckedState = boolean | "indeterminate";

interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "checked" | "defaultChecked"> {
  checked?: CheckedState;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked = false, disabled, onCheckedChange, onClick, ...props }, ref) => {
    const isChecked = checked === true;
    const isIndeterminate = checked === "indeterminate";
    const state = isIndeterminate ? "indeterminate" : isChecked ? "checked" : "unchecked";

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        data-slot="checkbox"
        data-state={state}
        disabled={disabled}
        className={cn(
          "peer grid size-[18px] shrink-0 cursor-pointer place-items-center rounded-[4px] border border-[var(--sp-border-strong)] bg-white text-white shadow-none outline-none transition-all",
          "hover:border-[var(--sp-blue)]/55 focus-visible:border-[var(--sp-blue)] focus-visible:ring-4 focus-visible:ring-primary/10",
          "data-[state=checked]:border-[var(--sp-blue)] data-[state=checked]:bg-[var(--sp-blue)] data-[state=indeterminate]:border-[var(--sp-blue)] data-[state=indeterminate]:bg-[var(--sp-blue)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            onCheckedChange?.(!isChecked);
          }
        }}
        {...props}
      >
        {isIndeterminate ? (
          <MinusIcon className="size-3" aria-hidden="true" strokeWidth={3} />
        ) : isChecked ? (
          <CheckIcon className="size-3" aria-hidden="true" strokeWidth={3} />
        ) : null}
      </button>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
