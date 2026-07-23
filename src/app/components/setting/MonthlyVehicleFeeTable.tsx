import { useState } from "react";
import {
  TableActionDropdown,
  type TableActionDropdownItem,
} from "@/app/components/common/TableActionDropdown";
import {
  DataTable,
  TableCheckbox,
  TablePagination,
  TBody,
  TD,
  TH,
  THead,
  TR,
  useTablePagination,
} from "@/app/components/ui/table";
import type { MonthlyVehicleFeeRow } from "@/app/data/setting";
import { Edit3, Trash2 } from "lucide-react";

export function MonthlyVehicleFeeTable({
  rows,
  onOpenDetail,
  onEdit,
  onDelete,
}: {
  rows: MonthlyVehicleFeeRow[];
  onOpenDetail: (row: MonthlyVehicleFeeRow) => void;
  onEdit: (row: MonthlyVehicleFeeRow) => void;
  onDelete: (row: MonthlyVehicleFeeRow) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const pagination = useTablePagination({ data: rows, defaultPageSize: 10 });
  const visibleRows = pagination.paginatedData;
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id));
  const partiallySelected =
    visibleRows.some((row) => selectedRows.includes(row.id)) && !allSelected;

  return (
    <DataTable
      minWidth={1120}
      footer={
        <TablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalItems={pagination.totalItems}
          onPageChange={pagination.setPage}
          onPageSizeChange={pagination.setPageSize}
        />
      }
    >
      <THead>
        <TR>
          <TH className="w-10 text-center" sticky="left" stickyOffset={0}>
            <TableCheckbox
              checked={allSelected}
              indeterminate={partiallySelected}
              onCheckedChange={(checked) => {
                const visibleIds = visibleRows.map((row) => row.id);
                setSelectedRows((current) =>
                  checked
                    ? Array.from(new Set([...current, ...visibleIds]))
                    : current.filter((id) => !visibleIds.includes(id)),
                );
              }}
            />
          </TH>
          <TH className="w-[80px] text-center">Thứ tự</TH>
          <TH className="w-[160px]">Nhóm xe</TH>
          <TH className="w-[320px]">Tên cấu hình</TH>
          <TH className="w-[140px] text-center">Từ xe</TH>
          <TH className="w-[140px] text-center">Đến xe</TH>
          <TH className="w-[160px] text-right">Đơn giá</TH>
          <TH className="w-[56px] text-center" sticky="right" stickyOffset={0} stickyOnCompact />
        </TR>
      </THead>
      <TBody>
        {visibleRows.map((row) => {
          const selected = selectedRows.includes(row.id);
          const actions: TableActionDropdownItem[] = [
            {
              id: "edit",
              label: "Sửa",
              icon: <Edit3 className="size-4" />,
              onSelect: () => onEdit(row),
            },
            {
              id: "delete",
              label: "Xóa",
              icon: <Trash2 className="size-4" />,
              tone: "danger",
              onSelect: () => onDelete(row),
            },
          ];

          return (
            <TR
              key={row.id}
              selected={selected}
              onRowDetail={() => onOpenDetail(row)}
              rowDetailLabel={`Xem phí ${row.configName}`}
            >
              <TD className="text-center" sticky="left" stickyOffset={0} data-no-row-detail>
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => {
                    setSelectedRows((current) =>
                      checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                    );
                  }}
                />
              </TD>
              <TD className="text-center">{row.displayOrder}</TD>
              <TD>{row.vehicleGroup}</TD>
              <TD className="font-medium text-strong">{row.configName}</TD>
              <TD className="text-center">{row.fromVehicle}</TD>
              <TD className="text-center">{row.toVehicle}</TD>
              <TD className="text-right font-semibold text-strong">{row.price}</TD>
              <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact data-no-row-detail>
                <TableActionDropdown
                  detailLabel="Xem"
                  onViewDetail={() => onOpenDetail(row)}
                  actions={actions}
                />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}
