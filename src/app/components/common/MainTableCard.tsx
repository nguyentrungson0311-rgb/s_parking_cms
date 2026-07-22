import { useRef, useState, type ReactNode } from "react";
import {
  FilterPanel,
  type FilterPanelField,
  type FilterPanelValues,
} from "@/app/components/common/FilterPanel";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { SearchInput } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

type MainTableCardActionContext = {
  filterButton: ReactNode;
  hasFilter: boolean;
  openFilter: () => void;
};

type MainTableCardActions =
  | ReactNode
  | ((context: MainTableCardActionContext) => ReactNode);

export function MainTableCard({
  title,
  description,
  refreshLabel = "Làm mới",
  showRefresh = true,
  searchPlaceholder = "Tìm kiếm...",
  actions,
  filterFields,
  filterValues,
  defaultFilterValues,
  filterTitle = "Bộ lọc",
  filterButtonLabel = "",
  onFilterApply,
  onFilterReset,
  children,
  className,
  titleClassName,
}: {
  title: string;
  description?: string;
  refreshLabel?: string;
  showRefresh?: boolean;
  searchPlaceholder?: string;
  actions?: MainTableCardActions;
  filterFields?: FilterPanelField[];
  filterValues?: FilterPanelValues;
  defaultFilterValues?: FilterPanelValues;
  filterTitle?: string;
  filterButtonLabel?: string;
  onFilterApply?: (values: FilterPanelValues) => void;
  onFilterReset?: (values: FilterPanelValues) => void;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [internalFilterValues, setInternalFilterValues] = useState<FilterPanelValues>(
    defaultFilterValues ?? {},
  );
  const [filtersApplied, setFiltersApplied] = useState(false);
  const filterAnchorRef = useRef<HTMLSpanElement>(null);
  const hasFilter = Boolean(filterFields?.length);
  const currentFilterValues = filterValues ?? internalFilterValues;
  const filterButton = hasFilter ? (
    <span ref={filterAnchorRef} className="inline-flex">
      <Button
        variant={filtersApplied ? "outline-primary" : "outline"}
        size="icon-sm"
        className={cn("size-9.5", filtersApplied && "bg-theme-soft")}
        aria-label={filterButtonLabel}
        title={filterButtonLabel}
        onClick={() => setFilterOpen((current) => !current)}
      >
        <i className="bi bi-funnel-fill text-base leading-none" aria-hidden="true" />
      </Button>
    </span>
  ) : null;
  const actionContent =
    typeof actions === "function"
      ? actions({
          filterButton,
          hasFilter,
          openFilter: () => setFilterOpen(true),
        })
      : (
          <>
            {filterButton}
            {actions}
          </>
        );

  const handleApplyFilters = (values: FilterPanelValues) => {
    if (!filterValues) setInternalFilterValues(values);
    setFiltersApplied(true);
    onFilterApply?.(values);
    setFilterOpen(false);
  };

  const handleResetFilters = (values: FilterPanelValues) => {
    if (!filterValues) setInternalFilterValues(values);
    setFiltersApplied(false);
    onFilterReset?.(values);
  };

  return (
    <>
      <Card
        className={cn(
          "sp-card-borderless flex h-full min-h-0 min-w-0 w-full max-w-full flex-col gap-4 overflow-hidden p-4",
          className,
        )}
      >
        <div className="sp-table-card-header grid min-w-0 shrink-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0">
            <div className="sp-table-card-title-row flex min-w-0 items-center justify-between gap-3">
              <h2 className={cn("font-sf min-w-0 truncate text-xl font-semibold leading-7 text-strong", titleClassName)}>
                {title}
              </h2>
              {showRefresh ? (
                <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 text-xs font-bold">
                  <RefreshCw />
                  {refreshLabel}
                </Button>
              ) : null}
            </div>
            {description ? (
              <p className="mt-1 text-base leading-6 text-muted">{description}</p>
            ) : null}
          </div>

          <div className="sp-table-card-actions flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
            <SearchInput
              className="sp-table-card-search !block h-9 min-w-40 flex-1 rounded-lg md:w-65 md:flex-none"
              placeholder={searchPlaceholder}
            />
            {hasFilter || actions ? actionContent : null}
          </div>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
      </Card>

      {filterFields ? (
        <FilterPanel
          open={filterOpen}
          title={filterTitle}
          fields={filterFields}
          values={currentFilterValues}
          defaultValues={defaultFilterValues}
          anchorRef={filterAnchorRef}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={() => setFilterOpen(false)}
        />
      ) : null}
    </>
  );
}
