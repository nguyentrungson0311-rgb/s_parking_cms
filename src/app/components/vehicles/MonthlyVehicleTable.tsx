import { useMemo, useState } from "react";
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
import { vehicleMonthVehicles as vehicles } from "@/app/data/vehiclemonth";
import type { MonthlyVehicleStatus } from "@/app/types";
import { ChevronDown } from "lucide-react";

const ACTION_COLUMN_WIDTH = 84;

export const MONTHLY_VEHICLE_STATUS: Record<MonthlyVehicleStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  paymentOverdue: { label: "Quá hạn TT", tone: "yellow" },
  locked: { label: "Khóa thẻ", tone: "red" },
};

export function MonthlyVehicleTable({ onOpenDetail }: { onOpenDetail: () => void }) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    vehicles.length > 0 && vehicles.every((vehicle) => selectedSet.has(vehicle.id));
  const isSomeSelected =
    vehicles.some((vehicle) => selectedSet.has(vehicle.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? vehicles.map((vehicle) => vehicle.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  return (
    <DataTable
      className="monthly-vehicle-table"
      minWidth="var(--monthly-vehicle-table-min-width, 2640px)"
      footer={<TablePagination summary="1-10 of 7,056 results" />}
    >
      <THead>
        <TR>
          <TH
            sticky="left"
            stickyOffset={0}
            className="w-10 cursor-pointer"
            onClick={() => handleSelectAll(!isAllSelected)}
          >
            <TableCheckbox
              checked={isAllSelected}
              indeterminate={isSomeSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Chọn tất cả"
            />
          </TH>
          <TH className="w-[160px]">Số thẻ (LOT)</TH>
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
          <TH sticky="right" stickyOffset={0} className="w-[84px] text-center">
            
          </TH>
        </TR>
      </THead>
      <TBody>
        {vehicles.map((vehicle) => {
          const selected = selectedSet.has(vehicle.id);
          const status = MONTHLY_VEHICLE_STATUS[vehicle.status];
          return (
            <TR key={vehicle.id} selected={selected}>
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                onClick={() => handleSelectRow(vehicle.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => handleSelectRow(vehicle.id, checked)}
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
              <TD sticky="right" stickyOffset={0}>
                <button
                  type="button"
                  onClick={onOpenDetail}
                  className="mx-auto flex items-center justify-center gap-2 text-[var(--sp-muted)] hover:text-[var(--sp-blue)]"
                  aria-label="Xem chi tiết"
                >
                  <i className="bi bi-eye-fill text-[18px] leading-none" aria-hidden="true" />
                  <ChevronDown className="size-5" />
                </button>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}
