import { useCallback, useMemo, useState } from "react";
import type { FilterPanelValues } from "@/app/components/common/FilterPanel";

export type TableSearchField<TData> = keyof TData | ((row: TData) => unknown);

export type UseTableQueryOptions<TData, TFilters extends FilterPanelValues> = {
  rows: TData[];
  defaultFilters?: TFilters;
  searchFields?: Array<TableSearchField<TData>>;
  filter?: (row: TData, filters: TFilters) => boolean;
};

const VEHICLE_FILTER_TEXT: Record<string, string[]> = {
  car: ["ô tô", "o to"],
  motorbike: ["xe máy", "xe may"],
  electricMotorbike: ["xe máy điện", "xe may dien"],
  bike: ["xe đạp", "xe dap"],
  bicycle: ["xe đạp", "xe dap"],
};

const TICKET_FILTER_TEXT: Record<string, string[]> = {
  monthly: ["vé tháng", "ve thang"],
  daily: ["vé ngày", "ve ngay"],
  turn: ["vé lượt", "ve luot"],
  outside: ["vé ngoài", "ve ngoai"],
  external: ["vé ngoài", "ve ngoai", "thẻ khách", "the khach"],
};

export function normalizeTableQueryValue(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function getSearchFieldValue<TData>(row: TData, field: TableSearchField<TData>) {
  return typeof field === "function" ? field(row) : row[field];
}

export function matchesTableFilterValue(value: unknown, filterValue: unknown) {
  const filter = normalizeTableQueryValue(filterValue);
  if (!filter || filter === "all") return true;

  const normalizedValue = normalizeTableQueryValue(value);
  const aliases = [...(VEHICLE_FILTER_TEXT[filter] ?? []), ...(TICKET_FILTER_TEXT[filter] ?? [])];
  if (aliases.length > 0) {
    return aliases.some((alias) => normalizedValue === normalizeTableQueryValue(alias));
  }

  return normalizedValue === filter;
}

export function parseTableDate(value: unknown) {
  if (typeof value !== "string" || !value.trim() || value.trim() === "--") return null;

  const [datePart] = value.trim().split(" ");
  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  }

  const displayMatch = datePart.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!displayMatch) return null;

  const [, day, month, year] = displayMatch;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

export function useTableQuery<
  TData,
  TFilters extends FilterPanelValues = FilterPanelValues,
>({
  rows,
  defaultFilters,
  searchFields = [],
  filter,
}: UseTableQueryOptions<TData, TFilters>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TFilters>((defaultFilters ?? {}) as TFilters);

  const resetFilters = useCallback(
    (nextFilters?: TFilters) => {
      setFilters(nextFilters ?? ((defaultFilters ?? {}) as TFilters));
    },
    [defaultFilters],
  );

  const filteredRows = useMemo(() => {
    const keyword = normalizeTableQueryValue(search);

    return rows.filter((row) => {
      if (keyword && searchFields.length > 0) {
        const matchedSearch = searchFields.some((field) =>
          normalizeTableQueryValue(getSearchFieldValue(row, field)).includes(keyword),
        );
        if (!matchedSearch) return false;
      }

      return filter ? filter(row, filters) : true;
    });
  }, [filter, filters, rows, search, searchFields]);

  return {
    search,
    setSearch,
    filters,
    setFilters,
    resetFilters,
    filteredRows,
  };
}
