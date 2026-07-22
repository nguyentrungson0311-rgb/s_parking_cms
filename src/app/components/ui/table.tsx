import * as React from "react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";
export { TablePagination, useTablePagination } from "@/app/components/ui/pagination";

type StickySide = "left" | "right";

interface StickyCellProps {
  sticky?: StickySide;
  stickyOffset?: number;
  stickyOnCompact?: boolean;
}

type TableRowDetailEvent =
  | React.MouseEvent<HTMLTableRowElement>
  | React.KeyboardEvent<HTMLTableRowElement>;

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
  onRowDetail?: (event: TableRowDetailEvent) => void;
  rowDetailLabel?: string;
};

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  borderless?: boolean;
  containerClassName?: string;
  scrollClassName?: string;
  footer?: React.ReactNode;
  minWidth?: number | string;
  noRoundedTop?: boolean;
}

export function DataTable({
  borderless = false,
  className,
  containerClassName,
  scrollClassName,
  footer,
  minWidth = 1040,
  noRoundedTop = false,
  style,
  ...props
}: DataTableProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-table-bg",
        borderless ? "border-0" : "border border-border",
        noRoundedTop ? "rounded-b-md rounded-t-none" : "rounded-md",
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
        <div className="min-w-0 shrink-0 border-t border-border bg-table-footer">
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
        "sticky top-0 z-30 border-b border-border-strong bg-table-header text-md font-medium text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border-strong", className)} {...props} />;
}

export function TR({
  className,
  onClick,
  onKeyDown,
  onRowDetail,
  role,
  selected,
  tabIndex,
  rowDetailLabel,
  ...props
}: TableRowProps) {
  const detailEnabled = Boolean(onRowDetail);

  const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !onRowDetail || shouldSkipRowDetail(event)) return;
    onRowDetail(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !onRowDetail || shouldSkipRowDetail(event)) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onRowDetail(event);
  };

  return (
    <tr
      data-selected={selected ? "true" : undefined}
      role={detailEnabled ? role ?? "button" : role}
      tabIndex={detailEnabled ? tabIndex ?? 0 : tabIndex}
      aria-label={rowDetailLabel}
      className={cn(
        "group bg-table-row transition-colors hover:bg-table-row-hover data-[selected=true]:bg-table-selected data-[selected=true]:hover:bg-table-selected",
        detailEnabled && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-theme/20",
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

function shouldSkipRowDetail(event: TableRowDetailEvent) {
  const target = event.target;
  if (!(target instanceof Element)) return false;

  const interactiveElement = target.closest(
    [
      "button",
      "a",
      "input",
      "select",
      "textarea",
      "label",
      "[contenteditable='true']",
      "[role='button']",
      "[role='checkbox']",
      "[role='menu']",
      "[role='menuitem']",
      "[role='menuitemradio']",
      "[data-no-row-detail]",
      "[data-table-row-action]",
    ].join(","),
  );

  return Boolean(
    interactiveElement &&
      interactiveElement !== event.currentTarget,
  );
}

export function TH({
  className,
  sticky,
  stickyOffset = 0,
  stickyOnCompact = false,
  style,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & StickyCellProps) {
  return (
    <th
      className={cn(
        "h-11 whitespace-nowrap bg-table-header px-2 align-middle text-md font-medium leading-none text-muted",
        sticky === "left" && "sticky z-40 shadow-[2px_0_8px_rgba(18,32,51,0.06)]",
        sticky === "right" &&
          cn(
            "sticky z-40 shadow-[-2px_0_8px_rgba(18,32,51,0.06)]",
            !stickyOnCompact && "max-[1179px]:static max-[1179px]:shadow-none",
          ),
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
  stickyOnCompact = false,
  style,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & StickyCellProps) {
  return (
    <td
      className={cn(
        "h-14 whitespace-nowrap bg-table-row px-2 align-middle text-md font-regular text-text transition-colors group-hover:bg-table-row-hover group-data-[selected=true]:bg-table-selected group-data-[selected=true]:group-hover:bg-table-selected",
        sticky === "left" && "sticky z-20 shadow-[2px_0_8px_rgba(18,32,51,0.04)]",
        sticky === "right" &&
          cn(
            "sticky z-20 shadow-[-2px_0_8px_rgba(18,32,51,0.04)]",
            !stickyOnCompact && "max-[1179px]:static max-[1179px]:shadow-none",
          ),
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
