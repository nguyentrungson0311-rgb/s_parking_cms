import type * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeTone =
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "grey"
  | "yellow";

export type StatusBadgeConfig = {
  label: string;
  tone: StatusBadgeTone;
};

const statusToneClass: Record<StatusBadgeTone, string> = {
  green: "bg-[var(--sp-green-soft)] text-[var(--sp-green)]",
  blue:  "bg-[var(--sp-blue-soft)] text-[var(--sp-blue)]",
  orange: "bg-[var(--sp-orange-soft)] text-[var(--sp-orange)]",
  purple: "bg-[var(--sp-purple-soft)] text-[var(--sp-purple)]",
  red: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-fg)]",
  grey: "bg-[var(--sp-grey-soft)] text-[var(--sp-grey)]",
  yellow: "bg-[var(--sp-yellow-soft)] text-[var(--sp-yellow)]",
};

export function StatusBadge({
  className,
  tone,
  children,
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone: StatusBadgeTone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-[8px] px-2 py-1 text-sm font-medium leading-none sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-md",
        statusToneClass[tone],
        className,
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current sm:size-1.5" aria-hidden="true" />
      {children}
    </span>
  );
}
