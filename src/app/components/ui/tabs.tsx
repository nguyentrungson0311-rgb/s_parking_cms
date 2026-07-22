import { cn } from "@/lib/utils";

export type TabItem<TValue extends string = string> = {
  value: TValue;
  label: string;
  disabled?: boolean;
};

export function Tabs<TValue extends string = string>({
  value,
  items,
  onValueChange,
  className,
  tabClassName,
}: {
  value: TValue;
  items: Array<TabItem<TValue>>;
  onValueChange: (value: TValue) => void;
  className?: string;
  tabClassName?: string;
}) {
  return (
    <div className={cn("flex min-w-0 shrink-0 overflow-x-auto border-b border-border px-4", className)}>
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            style={{ fontWeight: active ? 600 : 500 }}
            className={cn(
              "h-10 shrink-0 border-b-2 px-4 text-base transition-colors disabled:cursor-not-allowed disabled:text-badge-disabled-fg",
              tabClassName,
              active
                ? "border-theme font-semibold text-theme"
                : "border-transparent font-medium text-muted hover:text-strong",
            )}
            aria-selected={active}
            role="tab"
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
