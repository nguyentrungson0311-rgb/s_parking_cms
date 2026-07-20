import type { PageId } from "@/app/types";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

const vehiclePages: Array<{ id: PageId; label: string }> = [
  { id: "vehicle-month", label: "Quản lý vé tháng" },
  { id: "vehicle-day", label: "Quản lý vé ngày" },
  { id: "vehicle-outside", label: "Quản lý vé ngoài" },
  { id: "shift-handover", label: "Giao ca" },
  { id: "overdue-vehicles", label: "Xe để quá ngày" },
  { id: "gate-management", label: "Quản lý mở cổng" },
  { id: "reminders", label: "Nhắc nhở" },
];

const summaryPages: Array<{ id: PageId; label: string }> = [
  { id: "summary-vehicles", label: "Quản lý xe" },
  { id: "monthly-report", label: "Báo cáo tháng" },
];

export function Sidebar({
  activePage,
  collapsed,
  onNavigate,
  onToggleCollapsed,
}: {
  activePage: PageId;
  collapsed: boolean;
  onNavigate: (page: PageId) => void;
  onToggleCollapsed: () => void;
}) {
  const showUpgrade = activePage === "dashboard" && !collapsed;
  const vehicleActive = vehiclePages.some((item) => item.id === activePage);
  const summaryActive = summaryPages.some((item) => item.id === activePage);
  const [expandedGroups, setExpandedGroups] = useState<{
    vehicles?: boolean;
    summary?: boolean;
  }>({});

  const vehicleExpanded = expandedGroups.vehicles ?? vehicleActive;
  const summaryExpanded = expandedGroups.summary ?? summaryActive;

  return (
    <aside className={cn("sp-sidebar gap-3", collapsed && "sp-sidebar-collapsed")}>
      <div
        className={cn(
          "flex h-[64px] shrink-0 items-center gap-2",
          collapsed && "w-full justify-center",
        )}
      >
        <div className="sp-sidebar-logo grid size-12 place-items-center rounded-full text-xl font-extrabold leading-none text-white">
          P
        </div>
        <div
          className={cn(
            "sp-sidebar-brand-text overflow-hidden text-xl font-extrabold leading-none text-[var(--sp-theme)]",
          )}
        >
          S-PARKING
        </div>
      </div>

      <div className="h-px w-full shrink-0 bg-[var(--sp-border)]" />

      <nav className="sp-sidebar-nav flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden">
        <SidebarButton
          active={activePage === "dashboard"}
          collapsed={collapsed}
          iconClass="bi-grid-fill"
          label="Tổng quan"
          onClick={() => onNavigate("dashboard")}
        />

        <SidebarGroup
          active={vehicleActive}
          collapsed={collapsed}
          expanded={vehicleExpanded}
          iconClass="bi-car-front-fill"
          label="Quản lý phương tiện"
          onNavigate={() => onNavigate("vehicle-month")}
          onToggle={() =>
            setExpandedGroups((current) => ({
              ...current,
              vehicles: !vehicleExpanded,
            }))
          }
        >
          {vehiclePages.map((item) => (
            <SidebarSubItem
              key={item.id}
              active={activePage === item.id}
              label={item.label}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </SidebarGroup>

        <SidebarGroup
          active={summaryActive}
          collapsed={collapsed}
          expanded={summaryExpanded}
          iconClass="bi-bar-chart-line-fill"
          label="Tổng hợp"
          onNavigate={() => onNavigate("summary-vehicles")}
          onToggle={() =>
            setExpandedGroups((current) => ({
              ...current,
              summary: !summaryExpanded,
            }))
          }
        >
          {summaryPages.map((item) => (
            <SidebarSubItem
              key={item.id}
              active={activePage === item.id}
              label={item.label}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </SidebarGroup>
      </nav>

     
      <div className="h-px w-full shrink-0 bg-[var(--sp-border)]" />

      <div
        className={cn(
          "flex w-full shrink-0 items-center gap-3",
          collapsed && "flex-col",
        )}
      >
        <button
          className={cn(
            "sp-sidebar-parent-item",
            collapsed
              ? "mx-auto grid size-10 flex-none place-items-center rounded-md p-0 text-[var(--sp-muted)] transition-all duration-150 ease-out hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-theme)]"
              : "flex h-12 min-w-0 flex-1 items-center gap-4 rounded-md px-4 text-[var(--sp-muted)] transition-all duration-150 ease-out hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-strong)]",
          )}
          title={collapsed ? "Cài đặt" : undefined}
        >
          <i className="bi bi-gear-fill shrink-0 text-[20px] leading-none" aria-hidden="true" />
          {!collapsed ? <span className="sp-sidebar-label overflow-hidden">Cài đặt</span> : null}
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--sp-sidebar-control)] text-[var(--sp-muted)] transition-all duration-150 ease-out hover:border-[var(--sp-theme)]/40 hover:bg-[var(--accent)] hover:text-[var(--sp-theme)]"
          title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          aria-pressed={collapsed}
        >
          {collapsed ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
        </button>
      </div>
    </aside>
  );
}

function SidebarButton({
  active,
  collapsed,
  iconClass,
  label,
  onClick,
}: {
  active: boolean;
  collapsed: boolean;
  iconClass: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : "false"}
      title={collapsed ? label : undefined}
      className={cn(
        "sp-sidebar-parent-item relative flex h-10 w-full max-w-full items-center gap-4 overflow-hidden rounded-md px-4 text-left transition-all duration-150 ease-out",
        collapsed && "mx-auto w-10 justify-center gap-0 px-0",
        active && collapsed
          ? "bg-[var(--accent)] text-[var(--sp-theme)]"
          : active
            ? "bg-[var(--accent)] text-[var(--sp-theme)] before:absolute before:bottom-2 before:left-0 before:top-2 before:w-1 before:rounded-full before:bg-[var(--sp-theme)]"
            : "bg-[var(--sp-sidebar-item)] text-[var(--sp-muted)] hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-strong)]",
      )}
    >
      <i className={cn("bi shrink-0 text-[22px] leading-none", iconClass)} aria-hidden="true" />
      <span className="sp-sidebar-label min-w-0 overflow-hidden truncate">
        {label}
      </span>
    </button>
  );
}

function SidebarGroup({
  active,
  collapsed,
  expanded,
  iconClass,
  label,
  onNavigate,
  onToggle,
  children,
}: {
  active: boolean;
  collapsed: boolean;
  expanded: boolean;
  iconClass: string;
  label: string;
  onNavigate: () => void;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={() => {
          if (collapsed) {
            onNavigate();
            return;
          }
          if (active) {
            onToggle();
            return;
          }
          onNavigate();
        }}
        data-active={active ? "true" : "false"}
        title={collapsed ? label : undefined}
        className={cn(
          "sp-sidebar-parent-item relative flex h-10 w-full max-w-full items-center gap-2 overflow-hidden rounded-md px-4 text-left transition-all duration-150 ease-out",
          collapsed && "mx-auto w-10 justify-center gap-0 px-0",
          active && collapsed
            ? "bg-[var(--accent)] text-[var(--sp-theme)] hover:bg-[var(--accent)] hover:text-[var(--sp-theme)]"
            : active
              ? "bg-[var(--sp-sidebar-item)] text-[var(--sp-theme)] hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-theme)]"
            : "bg-[var(--sp-sidebar-item)] text-[var(--sp-muted)] hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-strong)]",
        )}
      >
        <i className={cn("bi shrink-0 text-[20px] leading-none", iconClass)} aria-hidden="true" />
        <span className="sp-sidebar-label min-w-0 flex-1 overflow-hidden truncate">
          {label}
        </span>
        <span
          role="button"
          tabIndex={0}
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded hover:bg-[var(--sp-sidebar-item-hover)]",
            collapsed && "hidden",
          )}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onToggle();
            }
          }}
          aria-label={expanded ? "Thu gọn menu" : "Mở rộng menu"}
        >
          <ChevronDown
            className={cn("size-4 transition-transform", expanded ? "rotate-180" : "")}
          />
        </span>
      </button>
      {expanded && !collapsed ? <div className="sp-sidebar-subitems grid gap-2 py-1 pl-5 pr-1">{children}</div> : null}
    </div>
  );
}

function SidebarSubItem({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={cn(
        "sp-sidebar-subitem relative flex h-10 w-full max-w-full items-center overflow-hidden rounded-md px-4 py-2 text-left transition-all duration-150 ease-out",
        active
          ? "bg-[var(--accent)] text-[var(--sp-theme)] before:absolute before:bottom-2 before:left-0 before:top-2 before:w-1 before:rounded-full before:bg-[var(--sp-theme)]"
          : "bg-[var(--sp-sidebar-item)] text-[var(--sp-muted)] hover:bg-[var(--sp-sidebar-item-hover)] hover:text-[var(--sp-strong)]",
      )}
    >
      <span className="min-w-0 truncate">
        {label}
      </span>
    </button>
  );
}
