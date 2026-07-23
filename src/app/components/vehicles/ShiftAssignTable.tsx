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
  useTablePagination,
} from "@/app/components/ui/table";
import {
  TableActionDropdown,
  type TableActionDropdownItem,
} from "@/app/components/common/TableActionDropdown";
import type { ShiftAssign, ShiftAssignStatus } from "@/app/types";
import { AlertTriangle, LogOut, Pencil } from "lucide-react";

const ACTION_COLUMN_WIDTH = 56;

const SHIFT_ASSIGN_ACTIONS: TableActionDropdownItem[] = [
  { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
  {
    id: "report-lost-card",
    label: "Báo mất thẻ",
    icon: <AlertTriangle className="size-4" />,
    tone: "danger",
  },
  { id: "release-vehicle", label: "Cho xe ra khỏi bãi", icon: <LogOut className="size-4" /> },
];

export const SHIFT_ASSIGN_STATUS: Record<ShiftAssignStatus, StatusBadgeConfig> = {
  inYard: { label: "Đang trong bãi", tone: "orange" },
  exited: { label: "Đã ra", tone: "green" },
};

export function ShiftAssignTable({
  rows,
  ticketType,
  embedded = false,
  onOpenDetail,
}: {
  rows: ShiftAssign[];
  ticketType?: ShiftAssign["ticketType"];
  embedded?: boolean;
  onOpenDetail?: (item: ShiftAssign) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const filteredRows = useMemo(
    () => (ticketType ? rows.filter((item) => item.ticketType === ticketType) : rows),
    [rows, ticketType],
  );
  const pagination = useTablePagination({ data: filteredRows, defaultPageSize: 10 });
  const visibleShiftAssigns = pagination.paginatedData;
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    visibleShiftAssigns.length > 0 && visibleShiftAssigns.every((item) => selectedSet.has(item.id));
  const isSomeSelected =
    visibleShiftAssigns.some((item) => selectedSet.has(item.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    const visibleIds = visibleShiftAssigns.map((item) => item.id);
    setSelectedRows((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((rowId) => !visibleIds.includes(rowId)),
    );
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  return (
    <DataTable
      className="shift-assign-table"
      borderless={embedded}
      noRoundedTop={embedded}
      noRoundedLeft={embedded}
      minWidth="var(--shift-assign-table-min-width, 2520px)"
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
            className="w-10 text-center"
            onClick={() => handleSelectAll(!isAllSelected)}
          >
            <TableCheckbox
              checked={isAllSelected}
              indeterminate={isSomeSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Chọn tất cả"
            />
          </TH>
          <TH className="w-[100px]">Mã(#)</TH>
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
          <TH sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center" />
        </TR>
      </THead>
      <TBody>
        {visibleShiftAssigns.map((item) => {
          const selected = selectedSet.has(item.id);
          const status = SHIFT_ASSIGN_STATUS[item.status];
          return (
            <TR
              key={item.id}
              selected={selected}
              onRowDetail={onOpenDetail ? () => onOpenDetail(item) : undefined}
              rowDetailLabel={`Xem chi tiết ${item.lotCardNumber}`}
            >
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 text-center"
                data-no-row-detail
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
              <TD
                sticky="right"
                stickyOffset={0}
                stickyOnCompact
                className="w-[56px] px-1 text-center"
                data-no-row-detail
              >
                <TableActionDropdown
                  onViewDetail={onOpenDetail ? () => onOpenDetail(item) : undefined}
                  actions={SHIFT_ASSIGN_ACTIONS}
                />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}
