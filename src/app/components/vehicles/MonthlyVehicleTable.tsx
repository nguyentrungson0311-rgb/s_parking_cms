import { StatusBadge, type StatusBadgeConfig } from "@/app/components/ui/status-badge";
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
import {
  TableActionDropdown,
  type TableActionDropdownItem,
} from "@/app/components/common/TableActionDropdown";
import { useTableState } from "@/app/hooks/useTableState";
import type { MonthlyVehicleStatus, Vehicle } from "@/app/types";
import { Lock, Pencil, Unlock } from "lucide-react";

const ACTION_COLUMN_WIDTH = 56;

export const MONTHLY_VEHICLE_STATUS: Record<MonthlyVehicleStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  paymentOverdue: { label: "Quá hạn TT", tone: "yellow" },
  locked: { label: "Khóa thẻ", tone: "red" },
};

export function MonthlyVehicleTable({
  rows,
  onOpenDetail,
}: {
  rows: Vehicle[];
  onOpenDetail: (mode?: "view" | "edit") => void;
}) {
  const table = useTableState({ rows, getRowId: (vehicle) => vehicle.id });
  const { pagination, visibleRows: visibleVehicles } = table;

  return (
    <DataTable
      empty={visibleVehicles.length === 0}
      minWidth={2640}
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
          <TH
            sticky="left"
            stickyOffset={0}
            className="w-10 cursor-pointer"
            onClick={() => table.selectAllVisible(!table.allSelected)}
          >
            <TableCheckbox
              checked={table.allSelected}
              indeterminate={table.partiallySelected}
              onCheckedChange={table.selectAllVisible}
              aria-label="Chọn tất cả"
            />
          </TH>
          <TH className="w-[100px]">Mã (#)</TH>
          <TH className="w-[120px]">Ngày giao</TH>
          <TH className="w-[150px]">Biển số</TH>
          <TH className="w-[170px]">Phương tiện</TH>
          <TH className="w-[130px]">Mẫu sơn</TH>
          <TH className="w-[200px]">Họ tên</TH>
          <TH className="w-[160px]">Số điện thoại</TH>
          <TH className="w-[220px]">Email</TH>
          <TH className="w-[150px]">Thời gian bắt đầu</TH>
          <TH className="w-[150px]">Thời gian kết thúc</TH>
          <TH className="w-[160px]">Căn hộ</TH>
          <TH className="w-[150px]">Loại phương tiện</TH>
          <TH className="w-[110px] text-center">Đã khóa</TH>
          <TH className="w-[120px] text-center">Đã sử dụng</TH>
          <TH className="w-[110px] text-center">Lần sử dụng</TH>
          <TH className="w-[170px]">Lần cuối</TH>
          <TH sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="w-[150px] pl-3 text-left">
            Trạng thái
          </TH>
          <TH sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center">
            
          </TH>
        </TR>
      </THead>
      <TBody>
        {visibleVehicles.map((vehicle) => {
          const selected = table.selectedSet.has(vehicle.id);
          const status = MONTHLY_VEHICLE_STATUS[vehicle.status];
          const actions: TableActionDropdownItem[] = [
            {
              id: "edit",
              label: "Sửa",
              icon: <Pencil className="size-4" />,
              onSelect: () => onOpenDetail("edit"),
            },
            {
              id: "lock-card",
              label: "Khóa thẻ",
              icon: <Lock className="size-4" />,
              tone: "danger",
            },
            {
              id: "unlock-card",
              label: "Mở thẻ",
              icon: <Unlock className="size-4" />,
            },
          ];

          return (
            <TR
              key={vehicle.id}
              selected={selected}
              onRowDetail={() => onOpenDetail("view")}
              rowDetailLabel={`Xem chi tiết ${vehicle.lotCardNumber}`}
            >
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                data-no-row-detail
                onClick={() => table.selectRow(vehicle.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => table.selectRow(vehicle.id, checked)}
                  aria-label={`Chọn ${vehicle.lotCardNumber}`}
                />
              </TD>
              <TD className="font-medium">{vehicle.lotCardNumber}</TD>
              <TD>{vehicle.deliveredAt}</TD>
              <TD>{vehicle.plate}</TD>
              <TD>{vehicle.vehicleName}</TD>
              <TD>{vehicle.paintColor}</TD>
              <TD>{vehicle.owner}</TD>
              <TD>{vehicle.phone}</TD>
              <TD>{vehicle.email}</TD>
              <TD>{vehicle.startedAt}</TD>
              <TD>{vehicle.endedAt}</TD>
              <TD>{vehicle.apartment}</TD>
              <TD>{vehicle.vehicleType}</TD>
              <TD className="text-center">{vehicle.locked ? "1" : "0"}</TD>
              <TD className="text-center">
                <TableCheckbox checked={vehicle.used} disabled aria-label="Đã sử dụng" />
              </TD>
              <TD className="text-center">{vehicle.usageCount}</TD>
              <TD>{vehicle.lastUsedAt}</TD>
              <TD sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="pl-3 text-left">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </TD>
              <TD
                sticky="right"
                stickyOffset={0}
                stickyOnCompact
                className="w-[56px] px-1 text-center"
                data-no-row-detail
              >
                <TableActionDropdown
                  onViewDetail={() => onOpenDetail("view")}
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
