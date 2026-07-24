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
} from "@/app/components/ui/table";
import { useTableState } from "@/app/hooks/useTableState";
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
  const table = useTableState({ rows, getRowId: (row) => row.id });
  const { pagination, visibleRows } = table;

  return (
    <DataTable
      borderless
      empty={visibleRows.length === 0}
      noRoundedTop
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
              checked={table.allSelected}
              indeterminate={table.partiallySelected}
              onCheckedChange={(checked) => {
                table.selectAllVisible(checked);
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
          const selected = table.selectedSet.has(row.id);
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
                  table.selectRow(row.id, checked);
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
