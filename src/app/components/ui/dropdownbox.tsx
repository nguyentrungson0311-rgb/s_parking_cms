import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function DropdownBox({
  options,
  value,
  onSelect,
  className,
  showSelectedIcon = true,
  emptyText = "Không có lựa chọn",
}: {
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  className?: string;
  showSelectedIcon?: boolean;
  emptyText?: string;
}) {
  return (
    <div
      className={cn(
        "sp-control-popover absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-[8px] border border-border bg-surface p-1 shadow-sp-soft",
        className,
      )}
      role="listbox"
    >
      {options.length === 0 ? (
        <div className="px-3 py-2 text-sm font-medium text-muted">{emptyText}</div>
      ) : null}

      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex min-h-9 w-full items-center gap-2 rounded-[7px] px-3 text-left text-base font-medium text-text transition hover:bg-badge-neutral-bg disabled:cursor-not-allowed disabled:text-subtle",
              selected && "bg-theme-soft text-theme",
            )}
          >
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            {selected && showSelectedIcon ? <Check className="size-4 shrink-0" /> : null}
          </button>
        );
      })}
    </div>
  );
}
