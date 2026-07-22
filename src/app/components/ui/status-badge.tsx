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
  green: "bg-green-soft text-green",
  blue: "bg-blue-soft text-blue",
  orange: "bg-orange-soft text-orange",
  purple: "bg-purple-soft text-purple",
  red: "bg-badge-danger-bg text-badge-danger-fg",
  grey: "bg-grey-soft text-grey",
  yellow: "bg-yellow-soft text-yellow",
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
        "inline-flex items-center gap-1 whitespace-nowrap rounded-[4px] px-1.5 py-1.5 text-xs font-medium leading-none sm:gap-1.5 sm:px-2 sm:py-1.5 sm:text-sm sm:rounded-[8px]",
        statusToneClass[tone],
        className,
      )}
    >
      <span className="size-1 shrink-0 rounded-full bg-current sm:size-1.5" aria-hidden="true" />
      {children}
    </span>
  );
}
