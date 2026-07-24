import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { InputSelect } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function useTablePagination<T>({
  data,
  defaultPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: {
  data: T[];
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const isShowingAll = pageSize === -1;
  const totalItems = data.length;
  const totalPages = isShowingAll ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = isShowingAll ? 0 : (safePage - 1) * pageSize;
  const endIndex = isShowingAll ? totalItems : Math.min(startIndex + pageSize, totalItems);
  const paginatedData = isShowingAll ? data : data.slice(startIndex, endIndex);

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return {
    page: safePage,
    pageSize,
    pageSizeOptions,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    paginatedData,
    isShowingAll,
    setPage,
    setPageSize: handlePageSizeChange,
  };
}

export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
  summary,
}: {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  summary?: string;
}) {
  const controlled = totalItems !== undefined && page !== undefined && pageSize !== undefined;
  const isShowingAll = pageSize === -1;
  const totalPages = controlled && !isShowingAll ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;
  const safePage = controlled ? Math.min(page, totalPages) : 1;
  const startIndex = controlled ? (isShowingAll ? 0 : (safePage - 1) * pageSize) : 0;
  const endIndex = controlled ? (isShowingAll ? totalItems : Math.min(startIndex + pageSize, totalItems)) : 0;
  const displaySummary =
    summary ??
    (controlled
      ? totalItems === 0
        ? "Hiển thị 0 của 0 kết quả"
        : `Hiển thị ${startIndex + 1}-${endIndex} của ${totalItems} kết quả`
      : "");
  const pages = getVisiblePages(safePage, totalPages);
  const pageSizeSelectOptions = [
    ...pageSizeOptions.map((option) => ({
      value: String(option),
      label: `${option}`,
    })),
    { value: "-1", label: "All" },
  ];

  return (
    <div className={cn("relative flex h-[54px] min-w-0 items-center justify-between gap-3 bg-table-footer px-3 text-md font-medium text-muted", className)}>
      <span className="min-w-0 truncate">{displaySummary}</span>
      {controlled ? (
        <div className="flex min-w-0 items-center gap-2">
          <div className="sp-table-scroll flex min-w-0 items-center gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              className="size-6 p-0 rounded-[8px]"
              disabled={safePage === 1 || isShowingAll}
              onClick={() => onPageChange?.(safePage - 1)}
            >
              <ChevronLeft />
            </Button>

            {!isShowingAll
              ? pages.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="grid h-7 min-w-7 place-items-center bg-surface text-xs font-extrabold text-muted"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={
                        item === safePage
                          ? "grid h-7 min-w-7 place-items-center rounded-[8px] border border-theme bg-theme px-2 font-extrabold text-white"
                          : "grid h-7 min-w-7 place-items-center rounded-[8px] border border-border bg-surface px-2 font-medium text-muted hover:bg-table-row-hover"
                      }
                      onClick={() => onPageChange?.(item)}
                    >
                      {item}
                    </button>
                  ),
                )
              : null}

            <Button
              variant="outline"
              size="sm"
              className="size-6 p-0 rounded-[8px]"
              disabled={safePage === totalPages || isShowingAll}
              onClick={() => onPageChange?.(safePage + 1)}
            >
              <ChevronRight />
            </Button>
          </div>

          <InputSelect
            wrapperClassName="w-18 shrink-0"
            triggerClassName="h-8 px-2 text-sm font-bold text-muted"
            dropdownClassName="bottom-[calc(100%+8px)] top-auto"
            options={pageSizeSelectOptions}
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
            showSelectedIcon={false}
          />
        </div>
      ) : null}
    </div>
  );
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis" as const, totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis" as const, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis" as const, currentPage - 1, currentPage, currentPage + 1, "ellipsis" as const, totalPages];
}
