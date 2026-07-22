import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, MoreVertical } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

export type TableActionDropdownItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  tone?: "default" | "danger";
  onSelect?: () => void;
};

const MENU_GAP = 8;
const MENU_MARGIN = 8;
const MENU_ITEM_HEIGHT = 36;
const MENU_VERTICAL_PADDING = 8;
const MENU_MAX_HEIGHT = 288;
const MENU_FALLBACK_WIDTH = 140;

export function TableActionDropdown({
  detailLabel = "Xem chi tiết",
  onViewDetail,
  actions = [],
}: {
  detailLabel?: string;
  onViewDetail?: () => void;
  actions?: TableActionDropdownItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLSpanElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const menuItems: TableActionDropdownItem[] = [
    {
      id: "view-detail",
      label: detailLabel,
      icon: <Eye className="size-4" />,
      onSelect: onViewDetail,
    },
    ...actions,
  ];

  const updatePosition = React.useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || MENU_FALLBACK_WIDTH;
    const boundaryTop = MENU_MARGIN;
    const boundaryBottom = window.innerHeight - MENU_MARGIN;
    const estimatedMenuHeight = Math.min(
      MENU_MAX_HEIGHT,
      menuItems.length * MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING,
    );
    const menuHeight = menuRef.current?.offsetHeight || estimatedMenuHeight;
    const spaceBelow = boundaryBottom - rect.bottom - MENU_GAP;
    const spaceAbove = rect.top - boundaryTop - MENU_GAP;
    const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
    const left = Math.min(
      Math.max(MENU_MARGIN, rect.right - menuWidth),
      window.innerWidth - menuWidth - MENU_MARGIN,
    );
    const top = openAbove
      ? Math.max(boundaryTop, rect.top - menuHeight - MENU_GAP)
      : Math.max(
          boundaryTop,
          Math.min(rect.bottom + MENU_GAP, boundaryBottom - menuHeight),
        );

    setPosition({ top, left });
  }, [menuItems.length]);

  React.useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  const handleSelect = (item: TableActionDropdownItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  };

  return (
    <>
      <span
        ref={buttonRef}
        className="mx-auto inline-flex"
        data-table-row-action
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(
            "shadow-sm text-muted hover:bg-theme-soft hover:text-theme",
            open && "bg-theme-soft text-theme",
          )}
          aria-label="Mở menu hành động"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(event) => {
            event.stopPropagation();
            updatePosition();
            setOpen((current) => !current);
          }}
        >
          <MoreVertical className="size-4" />
        </Button>
      </span>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[120] min-w-36 max-w-[calc(100vw-16px)] max-h-72 overflow-y-auto rounded-[8px] border border-border bg-surface p-1 shadow-sp-soft"
              style={{ top: position.top, left: position.left }}
              role="menu"
              data-table-row-action
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className={cn(
                    "flex min-h-9 w-full items-center gap-2 rounded-[7px] px-3 text-left text-base font-medium text-text transition hover:bg-badge-neutral-bg disabled:cursor-not-allowed disabled:text-subtle",
                    item.tone === "danger" && "text-destructive",
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  {item.icon ? (
                    <span className="grid size-4 shrink-0 place-items-center">{item.icon}</span>
                  ) : null}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
