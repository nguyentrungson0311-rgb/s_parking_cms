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
import { shiftAssigns } from "@/app/data/shiftassign";
import type { ShiftAssign, ShiftAssignStatus } from "@/app/types";
import { ChevronDown } from "lucide-react";

const ACTION_COLUMN_WIDTH = 84;

export const SHIFT_ASSIGN_STATUS: Record<ShiftAssignStatus, StatusBadgeConfig> = {
  inYard: { label: "Đang trong bãi", tone: "orange" },
  exited: { label: "Đã ra", tone: "green" },
};

export function ShiftAssignTable({
  onOpenDetail,
}: {
  onOpenDetail: (item: ShiftAssign) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    shiftAssigns.length > 0 && shiftAssigns.every((item) => selectedSet.has(item.id));
  const isSomeSelected =
    shiftAssigns.some((item) => selectedSet.has(item.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? shiftAssigns.map((item) => item.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  return (
    <DataTable
      className="shift-assign-table"
      minWidth="var(--shift-assign-table-min-width, 2520px)"
      footer={<TablePagination summary="1-10 of 2,416 results" />}
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
          <TH className="w-[130px]">Vé số</TH>
          <TH className="w-[130px]">Mã số thẻ</TH>
          <TH className="w-[170px]">Loại phương tiện</TH>
          <TH className="w-[120px]">Loại vé</TH>
          <TH className="w-[170px]">Ngày vào</TH>
          <TH className="w-[170px]">Ngày ra</TH>
          <TH className="w-[190px]">Thanh toán</TH>
          <TH className="w-[150px]">Biển số</TH>
          <TH className="w-[190px]">Khách hàng</TH>
          <TH className="w-[130px]">Mã căn</TH>
          <TH className="w-[180px]">Tên phương tiện</TH>
          <TH className="w-[120px]">Ca vào</TH>
          <TH className="w-[120px]">Ca ra</TH>
          <TH className="w-[100px] text-center">Status</TH>
          <TH sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="w-[150px] pl-3 text-left">
            Trạng thái
          </TH>
          <TH sticky="right" stickyOffset={0} className="w-[84px] text-center" />
        </TR>
      </THead>
      <TBody>
        {shiftAssigns.map((item) => {
          const selected = selectedSet.has(item.id);
          const status = SHIFT_ASSIGN_STATUS[item.status];
          return (
            <TR key={item.id} selected={selected}>
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                onClick={() => handleSelectRow(item.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => handleSelectRow(item.id, checked)}
                  aria-label={`Chọn ${item.lotCardNumber}`}
                />
              </TD>
              <TD className="font-medium">{item.lotCardNumber}</TD>
              <TD>{item.ticketNumber}</TD>
              <TD>{item.cardCode}</TD>
              <TD>{item.vehicleType}</TD>
              <TD>{item.ticketType}</TD>
              <TD>{item.checkedInAt}</TD>
              <TD>{item.checkedOutAt}</TD>
              <TD>{item.payment}</TD>
              <TD>{item.plate}</TD>
              <TD>{item.customer}</TD>
              <TD>{item.apartmentCode}</TD>
              <TD>{item.vehicleName}</TD>
              <TD>{item.shiftIn}</TD>
              <TD>{item.shiftOut}</TD>
              <TD className="text-center">{item.statusFlag ? "true" : "false"}</TD>
              <TD sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="pl-3 text-left">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </TD>
              <TD sticky="right" stickyOffset={0}>
                <button
                  type="button"
                  onClick={() => onOpenDetail(item)}
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
