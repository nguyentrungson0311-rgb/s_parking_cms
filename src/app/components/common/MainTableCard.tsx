import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { SearchInput } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function MainTableCard({
  title,
  description,
  refreshLabel = "Làm mới",
  searchPlaceholder,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  refreshLabel?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "sp-card-borderless flex h-full min-h-0 min-w-0 w-full max-w-full flex-col gap-4 overflow-hidden p-4",
        className,
      )}
    >
      <div className="grid min-w-0 shrink-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0">
          <div className="sp-table-card-title-row flex min-w-0 items-center justify-between gap-3">
            <h2 className="font-sf min-w-0 truncate text-xl font-semibold leading-7 text-[var(--sp-strong)]">
              {title}
            </h2>
            <Button variant="ghost" size="sm" className="h-7 shrink-0 px-0 text-xs font-bold">
              <RefreshCw />
              {refreshLabel}
            </Button>
          </div>
          {description ? (
            <p className="mt-1 text-base leading-6 text-[var(--sp-muted)]">{description}</p>
          ) : null}
        </div>

        {searchPlaceholder ? (
          <SearchInput
            className="sp-table-card-search h-9 w-full rounded-lg md:max-w-[420px]"
            placeholder={searchPlaceholder}
          />
        ) : null}

        {actions ? (
          <div className="sp-table-card-actions flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
    </Card>
  );
}
