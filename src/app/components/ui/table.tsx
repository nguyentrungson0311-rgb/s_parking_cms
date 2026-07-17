import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type StickySide = "left" | "right";

interface StickyCellProps {
  sticky?: StickySide;
  stickyOffset?: number;
}

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  scrollClassName?: string;
  footer?: React.ReactNode;
  minWidth?: number | string;
}

export function DataTable({
  className,
  containerClassName,
  scrollClassName,
  footer,
  minWidth = 1040,
  style,
  ...props
}: DataTableProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden rounded-md border border-[var(--sp-border)] bg-[var(--sp-table-bg)]",
        containerClassName,
      )}
    >
      <div className={cn("sp-table-scroll min-h-0 min-w-0 flex-1 overflow-auto", scrollClassName)}>
        <table
          className={cn("w-full border-collapse text-left", className)}
          style={{
            minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
            ...style,
          }}
          {...props}
        />
      </div>
      {footer ? (
        <div className="min-w-0 shrink-0 border-t border-[var(--sp-border)] bg-[var(--sp-table-footer)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "sticky top-0 z-30 border-b border-[var(--sp-border-strong)] bg-[var(--sp-table-header)] text-md font-medium text-[var(--sp-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-[var(--sp-border-strong)]", className)} {...props} />;
}

export function TR({
  className,
  selected,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      data-selected={selected ? "true" : undefined}
      className={cn(
        "group bg-[var(--sp-table-row)] transition-colors hover:bg-[var(--sp-table-row-hover)] data-[selected=true]:bg-[var(--sp-table-selected)] data-[selected=true]:hover:bg-[var(--sp-table-selected)]",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  sticky,
  stickyOffset = 0,
  style,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & StickyCellProps) {
  return (
    <th
      className={cn(
        "h-11 whitespace-nowrap bg-[var(--sp-table-header)] px-2 align-middle text-md font-medium leading-none text-[var(--sp-muted)]",
        sticky === "left" && "sticky z-40 shadow-[2px_0_8px_rgba(18,32,51,0.06)]",
        sticky === "right" && "sticky z-40 shadow-[-2px_0_8px_rgba(18,32,51,0.06)]",
        className,
      )}
      style={{
        ...(sticky === "left" ? { left: stickyOffset } : null),
        ...(sticky === "right" ? { right: stickyOffset } : null),
        ...style,
      }}
      {...props}
    />
  );
}

export function TD({
  className,
  sticky,
  stickyOffset = 0,
  style,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & StickyCellProps) {
  return (
    <td
      className={cn(
        "h-14 whitespace-nowrap bg-[var(--sp-table-row)] px-2 align-middle text-md font-regular text-[var(--sp-text)] transition-colors group-hover:bg-[var(--sp-table-row-hover)] group-data-[selected=true]:bg-[var(--sp-table-selected)] group-data-[selected=true]:group-hover:bg-[var(--sp-table-selected)]",
        sticky === "left" && "sticky z-20 shadow-[2px_0_8px_rgba(18,32,51,0.04)]",
        sticky === "right" && "sticky z-20 shadow-[-2px_0_8px_rgba(18,32,51,0.04)]",
        className,
      )}
      style={{
        ...(sticky === "left" ? { left: stickyOffset } : null),
        ...(sticky === "right" ? { right: stickyOffset } : null),
        ...style,
      }}
      {...props}
    />
  );
}

export function TableCheckbox({
  checked,
  indeterminate,
  className,
  onCheckedChange,
  onClick,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox>,
  "checked" | "onCheckedChange"
> & {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : Boolean(checked)}
      className={cn("mx-auto", className)}
      onCheckedChange={(value) => onCheckedChange?.(value === true)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export function TablePagination({
  summary,
  className,
}: {
  summary: string;
  className?: string;
}) {
  return (
    <div className={cn("flex h-[54px] min-w-0 items-center justify-between gap-3 overflow-hidden bg-[var(--sp-table-footer)] px-3 text-md font-medium text-[var(--sp-muted)]", className)}>
      <span>{summary}</span>
      <div className="sp-table-scroll flex min-w-0 items-center gap-2 overflow-x-auto">
        <Button variant="outline" size="sm" className="size-[30px] p-0">
          <ChevronLeft />
        </Button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            className={
              page === 1
                ? "grid h-[30px] min-w-9 place-items-center rounded-[5px] border border-[var(--sp-blue)] bg-[var(--sp-blue)] px-2 font-extrabold text-white"
                : "grid h-[30px] min-w-9 place-items-center rounded-[5px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2 font-medium text-[var(--sp-muted)]"
            }
          >
            {page}
          </button>
        ))}
        <span className="grid h-[30px] min-w-[30px] place-items-center rounded-[5px] border border-[var(--sp-border)] bg-[var(--sp-surface)] text-xs font-extrabold text-[var(--sp-muted)]">
          ...
        </span>
        <button className="grid h-[30px] min-w-9 place-items-center rounded-[5px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2 font-medium text-[var(--sp-muted)]">
          706
        </button>
        <Button variant="outline" size="sm" className="size-[30px] p-0">
          <ChevronRight />
        </Button>
        <button className="ml-2 flex h-8 items-center gap-2 rounded-[5px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2 font-bold text-[var(--sp-muted)]">
          100 / page
          <ChevronDown className="size-4" />
        </button>
      </div>
    </div>
  );
}
