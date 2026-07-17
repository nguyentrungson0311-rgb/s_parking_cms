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
import { ListFilter, RefreshCw } from "lucide-react";

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
  searchPlaceholder,
  actions,
  filterFields,
  filterValues,
  defaultFilterValues,
  filterTitle = "Bộ lọc",
  filterButtonLabel = "Lọc",
  onFilterApply,
  onFilterReset,
  children,
  className,
}: {
  title: string;
  description?: string;
  refreshLabel?: string;
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
        size="md"
        className={cn(filtersApplied && "bg-[var(--sp-blue-soft)]")}
        onClick={() => setFilterOpen((current) => !current)}
      >
        <ListFilter />
        {filterButtonLabel}
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
        <div className="grid min-w-0 shrink-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0">
            <div className="sp-table-card-title-row flex min-w-0 items-center justify-between gap-3">
              <h2 className="font-sf min-w-0 truncate text-xl font-semibold leading-7 text-[var(--sp-strong)]">
                {title}
              </h2>
              <Button variant="ghost" size="sm" className="h-7 shrink-0 px-2 text-xs font-bold">
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

          {hasFilter || actions ? (
            <div className="sp-table-card-actions flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:col-start-2 md:row-start-1 md:justify-end">
              {actionContent}
            </div>
          ) : null}
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
