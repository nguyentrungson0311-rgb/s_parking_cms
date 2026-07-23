import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { SearchInput } from "@/app/components/ui/input";
import { Tabs, type TabItem } from "@/app/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export type ComplexTableCardTabs<TValue extends string = string> = {
  value: TValue;
  items: Array<TabItem<TValue>>;
  onValueChange: (value: TValue) => void;
  className?: string;
  tabClassName?: string;
};

export type ComplexTableCardTableHeader = {
  title?: ReactNode;
  actions?: ReactNode;
  searchPlaceholder?: string;
  showSearch?: boolean;
  className?: string;
  titleClassName?: string;
  searchClassName?: string;
};

export type ComplexTableCardProps<TValue extends string = string> = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  tabs?: ComplexTableCardTabs<TValue>;
  tableHeader?: ComplexTableCardTableHeader;
  children: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  asideClassName?: string;
  mainClassName?: string;
  contentClassName?: string;
};

export function ComplexTableCard<TValue extends string = string>({
  title,
  description,
  actions,
  aside,
  tabs,
  tableHeader,
  children,
  onBack,
  backLabel = "Quay lại",
  className,
  headerClassName,
  titleClassName,
  bodyClassName,
  asideClassName,
  mainClassName,
  contentClassName,
}: ComplexTableCardProps<TValue>) {
  const showTableSearch = tableHeader ? tableHeader.showSearch ?? true : false;
  const hasTableHeader = Boolean(
    tableHeader && (tableHeader.title || tableHeader.actions || showTableSearch),
  );

  return (
    <Card
      className={cn(
        "flex h-full min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden p-0",
        className,
      )}
    >
      <div
        className={cn(
          "grid min-w-0 shrink-0 items-center gap-3 border-b border-border px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto]",
          headerClassName,
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-9.5 shrink-0"
              aria-label={backLabel}
              onClick={onBack}
            >
              <ArrowLeft />
            </Button>
          ) : null}
          <div className="min-w-0">
            <h2
              className={cn(
                "font-sf min-w-0 truncate text-xl font-semibold leading-7 text-strong",
                titleClassName,
              )}
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 min-w-0 truncate text-sm font-medium leading-5 text-muted">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:justify-end">
            {actions}
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "grid min-h-0 min-w-0 flex-1",
          aside ? "grid-cols-[244px_minmax(0,1fr)] max-lg:grid-cols-1" : "grid-cols-1",
          bodyClassName,
        )}
      >
        {aside ? (
          <aside
            className={cn(
              "min-h-0 overflow-auto border-r border-border p-3 max-lg:border-r-0 max-lg:border-b",
              asideClassName,
            )}
          >
            {aside}
          </aside>
        ) : null}

        <div className={cn("flex min-h-0 min-w-0 flex-col overflow-hidden", mainClassName)}>
          {tabs ? (
            <Tabs
              value={tabs.value}
              items={tabs.items}
              onValueChange={tabs.onValueChange}
              className={cn("px-4", tabs.className)}
              tabClassName={tabs.tabClassName}
            />
          ) : null}

          {hasTableHeader ? (
            <div
              className={cn(
                "grid min-w-0 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 py-2 md:grid-cols-[minmax(0,1fr)_auto]",
                tableHeader?.className,
              )}
            >
              <div className="flex min-h-9 min-w-0 items-center">
                {tableHeader?.title ? (
                  <h3
                    className={cn(
                      "font-sf min-w-0 truncate text-[20px] font-semibold leading-6 text-strong",
                      tableHeader.titleClassName,
                    )}
                  >
                    {tableHeader.title}
                  </h3>
                ) : null}
              </div>

              <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:justify-end">
                {showTableSearch ? (
                  <SearchInput
                    className={cn(
                      "!block h-9 min-w-48 flex-1 rounded-lg md:w-80 md:flex-none",
                      tableHeader?.searchClassName,
                    )}
                    placeholder={tableHeader?.searchPlaceholder}
                  />
                ) : null}
                {tableHeader?.actions}
              </div>
            </div>
          ) : null}

          <div className={cn("min-h-0 min-w-0 flex-1 overflow-hidden", contentClassName)}>
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
