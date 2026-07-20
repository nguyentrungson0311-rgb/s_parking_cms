import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const weekdayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const monthLabels = Array.from({ length: 12 }, (_, index) => `Tháng ${index + 1}`);

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidIsoDate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && toIsoDate(date) === value;
}

export function formatDisplayDate(value: string) {
  if (!isValidIsoDate(value)) return value;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function parseDisplayDate(value: string) {
  const trimmed = value.trim();
  const displayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (!displayMatch) return trimmed;

  const [, day, month, year] = displayMatch;
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isValidIsoDate(isoDate) ? isoDate : trimmed;
}

export function CalendarBox({
  value,
  onSelect,
  className,
}: {
  value?: string;
  onSelect: (value: string) => void;
  className?: string;
}) {
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const selectedDate = isValidIsoDate(value) ? new Date(`${value}T00:00:00`) : new Date();
  const [visibleMonth, setVisibleMonth] = React.useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">("days");
  const [placement, setPlacement] = React.useState<"bottom" | "top">("bottom");
  const [yearPageStart, setYearPageStart] = React.useState(
    Math.floor(selectedDate.getFullYear() / 12) * 12,
  );

  React.useEffect(() => {
    if (!isValidIsoDate(value)) return;
    const nextDate = new Date(`${value}T00:00:00`);
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
  }, [value]);

  React.useLayoutEffect(() => {
    const updatePlacement = () => {
      const popover = popoverRef.current;
      const anchor = popover?.parentElement;

      if (!popover || !anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const popoverHeight = popover.offsetHeight;
      const gutter = 8;
      const spaceBelow = window.innerHeight - anchorRect.bottom;
      const spaceAbove = anchorRect.top;

      setPlacement(spaceBelow < popoverHeight + gutter && spaceAbove > spaceBelow ? "top" : "bottom");
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);

    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [viewMode]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());
  const years = Array.from({ length: 12 }, (_, index) => yearPageStart + index);
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });

  const goPrevious = () => {
    if (viewMode === "years") {
      setYearPageStart((current) => current - 12);
      return;
    }

    if (viewMode === "months") {
      setVisibleMonth(new Date(year - 1, month, 1));
      return;
    }

    setVisibleMonth(new Date(year, month - 1, 1));
  };

  const goNext = () => {
    if (viewMode === "years") {
      setYearPageStart((current) => current + 12);
      return;
    }

    if (viewMode === "months") {
      setVisibleMonth(new Date(year + 1, month, 1));
      return;
    }

    setVisibleMonth(new Date(year, month + 1, 1));
  };

  const openMonthYearPicker = () => {
    if (viewMode === "days") {
      setViewMode("months");
      return;
    }

    setYearPageStart(Math.floor(year / 12) * 12);
    setViewMode("years");
  };

  return (
    <div
      ref={popoverRef}
      className={cn(
        "sp-control-popover absolute left-0 z-50 w-[292px] rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-3 shadow-[var(--shadow-soft)]",
        placement === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="grid size-8 place-items-center rounded-md text-[var(--sp-muted)] hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]"
          onClick={goPrevious}
          aria-label={viewMode === "years" ? "Nhóm năm trước" : viewMode === "months" ? "Năm trước" : "Tháng trước"}
        >
          <ChevronLeft className="size-4" />
        </button>

        {viewMode === "years" ? (
          <div className="text-base font-bold text-[var(--sp-strong)]">
            {yearPageStart} - {yearPageStart + 11}
          </div>
        ) : (
          <button
            type="button"
            className="rounded-md px-3 py-1 text-base font-bold text-[var(--sp-strong)] transition hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]"
            onClick={openMonthYearPicker}
            aria-label={viewMode === "days" ? "Chọn tháng và năm" : "Chọn năm"}
          >
            {viewMode === "days" ? `Tháng ${month + 1}/${year}` : year}
          </button>
        )}

        <button
          type="button"
          className="grid size-8 place-items-center rounded-md text-[var(--sp-muted)] hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]"
          onClick={goNext}
          aria-label={viewMode === "years" ? "Nhóm năm sau" : viewMode === "months" ? "Năm sau" : "Tháng sau"}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {viewMode === "months" ? (
        <div className="grid grid-cols-3 gap-2">
          {monthLabels.map((label, index) => {
            const selected = index === month;

            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setVisibleMonth(new Date(year, index, 1));
                  setViewMode("days");
                }}
                className={cn(
                  "h-10 rounded-md px-2 text-sm font-medium text-[var(--sp-text)] transition hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]",
                  selected && "bg-[var(--sp-theme)] text-white hover:bg-[var(--sp-theme)] hover:text-white",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      ) : null}

      {viewMode === "years" ? (
        <div className="grid grid-cols-3 gap-2">
          {years.map((item) => {
            const selected = item === year;

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setVisibleMonth(new Date(item, month, 1));
                  setViewMode("months");
                }}
                className={cn(
                  "h-10 rounded-md px-2 text-sm font-medium text-[var(--sp-text)] transition hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]",
                  selected && "bg-[var(--sp-theme)] text-white hover:bg-[var(--sp-theme)] hover:text-white",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      ) : null}

      {viewMode === "days" ? (
        <>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-[var(--sp-muted)]">
            {weekdayLabels.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((date) => {
              const isoDate = toIsoDate(date);
              const selected = isoDate === value;
              const outside = date.getMonth() !== month;

              return (
                <button
                  key={isoDate}
                  type="button"
                  onClick={() => onSelect(isoDate)}
                  className={cn(
                    "grid size-9 place-items-center rounded-md text-sm font-medium text-[var(--sp-text)] transition hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]",
                    outside && "text-[var(--sp-subtle)]",
                    selected && "bg-[var(--sp-theme)] text-white hover:bg-[var(--sp-theme)] hover:text-white",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
