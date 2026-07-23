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

type TableActionMenuContextValue = {
  openActionMenuId: string | null;
  setOpenActionMenuId: (id: string | null) => void;
};

const TABLE_ACTION_MENU_OPEN_EVENT = "sp-table-action-menu-open";
const TableActionMenuContext = React.createContext<TableActionMenuContextValue | null>(null);
export const TABLE_SELECTION_COLUMN_WIDTH = 48;
const TABLE_CHECKBOX_CELL_CLASS =
  "w-[48px] min-w-[48px] max-w-[48px] cursor-pointer px-4 text-left [&_[data-slot=checkbox]]:mx-0";
const TABLE_CHECKBOX_CELL_STYLE: React.CSSProperties = {
  boxSizing: "border-box",
  width: TABLE_SELECTION_COLUMN_WIDTH,
  minWidth: TABLE_SELECTION_COLUMN_WIDTH,
  maxWidth: TABLE_SELECTION_COLUMN_WIDTH,
  paddingLeft: 16,
  paddingRight: 14,
  textAlign: "left",
};
const TABLE_CHECKBOX_COLUMN_STYLE: React.CSSProperties = {
  width: TABLE_SELECTION_COLUMN_WIDTH,
};

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  borderless?: boolean;
  containerClassName?: string;
  scrollClassName?: string;
  footer?: React.ReactNode;
  minWidth?: number | string;
  noRoundedTop?: boolean;
  noRoundedLeft?: boolean;
}

export function DataTable({
  borderless = false,
  children,
  className,
  containerClassName,
  scrollClassName,
  footer,
  minWidth = 1040,
  noRoundedTop = false,
  noRoundedLeft = false,
  style,
  ...props
}: DataTableProps) {
  const [openActionMenuId, setInternalOpenActionMenuId] = React.useState<string | null>(null);
  const setOpenActionMenuId = React.useCallback((id: string | null) => {
    if (id && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(TABLE_ACTION_MENU_OPEN_EVENT, { detail: id }));
    }

    setInternalOpenActionMenuId(id);
  }, []);
  const actionMenuContext = React.useMemo(
    () => ({ openActionMenuId, setOpenActionMenuId }),
    [openActionMenuId, setOpenActionMenuId],
  );

  React.useEffect(() => {
    const handleActionMenuOpen = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== "string") return;

      setInternalOpenActionMenuId((current) =>
        current && current !== event.detail ? null : current,
      );
    };

    window.addEventListener(TABLE_ACTION_MENU_OPEN_EVENT, handleActionMenuOpen);
    return () => window.removeEventListener(TABLE_ACTION_MENU_OPEN_EVENT, handleActionMenuOpen);
  }, []);

  const checkboxColumnStyles = getCheckboxColumnStyles(children);

  return (
    <TableActionMenuContext.Provider value={actionMenuContext}>
      <div
        className={cn(
          "flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-table-bg",
          borderless ? "border-0" : "border border-border",
          noRoundedTop ? "rounded-b-md rounded-t-none" : "rounded-md",
          noRoundedLeft && "rounded-l-none",
          containerClassName,
        )}
      >
        <div className={cn("sp-table-scroll min-h-0 min-w-0 flex-1 overflow-auto", scrollClassName)}>
          <table
            className={cn("w-full table-fixed border-collapse text-left", className)}
            style={{
              minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth,
              ...style,
            }}
            {...props}
          >
            {checkboxColumnStyles.some(Boolean) ? (
              <colgroup>
                {Array.from({ length: checkboxColumnStyles.length }, (_, index) => (
                  <col key={index} style={checkboxColumnStyles[index]} />
                ))}
              </colgroup>
            ) : null}
            {children}
          </table>
        </div>
        {footer ? (
          <div className="min-w-0 shrink-0 border-t border-border bg-table-footer">
            {footer}
          </div>
        ) : null}
      </div>
    </TableActionMenuContext.Provider>
  );
}

export function useTableActionMenu() {
  return React.useContext(TableActionMenuContext);
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
  const checkboxCell = sticky === "left" && hasTableCheckboxChild(props.children);

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
        checkboxCell && TABLE_CHECKBOX_CELL_CLASS,
      )}
      style={{
        ...style,
        ...(sticky === "left" ? { left: stickyOffset } : null),
        ...(sticky === "right" ? { right: stickyOffset } : null),
        ...(checkboxCell ? TABLE_CHECKBOX_CELL_STYLE : null),
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
  const checkboxCell = sticky === "left" && hasTableCheckboxChild(props.children);

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
        checkboxCell && TABLE_CHECKBOX_CELL_CLASS,
      )}
      style={{
        ...style,
        ...(sticky === "left" ? { left: stickyOffset } : null),
        ...(sticky === "right" ? { right: stickyOffset } : null),
        ...(checkboxCell ? TABLE_CHECKBOX_CELL_STYLE : null),
      }}
      {...props}
    />
  );
}

function getCheckboxColumnStyles(children: React.ReactNode): Array<React.CSSProperties | undefined> {
  const firstRowCells = getFirstTableRowCells(children);
  if (!firstRowCells.length) return [];

  const columnStyles: Array<React.CSSProperties | undefined> = [];
  let columnIndex = 0;

  firstRowCells.forEach((cell) => {
    const props = cell.props as React.ThHTMLAttributes<HTMLTableCellElement> &
      React.TdHTMLAttributes<HTMLTableCellElement> &
      StickyCellProps;
    const span = Number(props.colSpan) || 1;

    if (props.sticky === "left" && hasTableCheckboxChild(props.children)) {
      columnStyles[columnIndex] = TABLE_CHECKBOX_COLUMN_STYLE;
    }

    columnIndex += span;
  });

  return columnStyles;
}

function getFirstTableRowCells(children: React.ReactNode): React.ReactElement[] {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) continue;

    if (child.type === TR) {
      return React.Children.toArray(child.props.children).filter(React.isValidElement);
    }

    const nestedCells = getFirstTableRowCells(child.props.children);
    if (nestedCells.length) return nestedCells;
  }

  return [];
}

function hasTableCheckboxChild(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return false;
    if (child.type === TableCheckbox) return true;
    return hasTableCheckboxChild(child.props.children);
  });
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
