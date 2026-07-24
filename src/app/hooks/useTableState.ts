import { useMemo, useState } from "react";
import { useTablePagination } from "@/app/components/ui/table";

export type TableRowId = string | number;

export function useTableState<TData>({
  rows,
  getRowId,
  defaultPageSize = 10,
}: {
  rows: TData[];
  getRowId: (row: TData) => TableRowId;
  defaultPageSize?: number;
}) {
  const [selectedRows, setSelectedRows] = useState<TableRowId[]>([]);
  const pagination = useTablePagination({ data: rows, defaultPageSize });
  const visibleRows = pagination.paginatedData;
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const visibleRowIds = useMemo(() => visibleRows.map(getRowId), [getRowId, visibleRows]);
  const allSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedSet.has(id));
  const partiallySelected =
    visibleRowIds.some((id) => selectedSet.has(id)) && !allSelected;

  const selectAllVisible = (checked: boolean) => {
    setSelectedRows((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleRowIds]))
        : current.filter((id) => !visibleRowIds.includes(id)),
    );
  };

  const selectRow = (id: TableRowId, checked: boolean) => {
    setSelectedRows((current) =>
      checked
        ? Array.from(new Set([...current, id]))
        : current.filter((rowId) => rowId !== id),
    );
  };

  return {
    pagination,
    visibleRows,
    selectedRows,
    selectedSet,
    allSelected,
    partiallySelected,
    selectAllVisible,
    selectRow,
    setSelectedRows,
  };
}

