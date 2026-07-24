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
import type { DailyCard, DailyCardStatus } from "@/app/types";
import { Lock, Pencil, Unlock } from "lucide-react";

const ACTION_COLUMN_WIDTH = 56;

const DAILY_CARD_ACTIONS: TableActionDropdownItem[] = [
  { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
  { id: "lock-card", label: "Khóa thẻ", icon: <Lock className="size-4" />, tone: "danger" },
  { id: "unlock-card", label: "Mở thẻ", icon: <Unlock className="size-4" /> },
];

export const DAILY_CARD_STATUS: Record<DailyCardStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  locked: { label: "Khóa thẻ", tone: "red" },
  expired: { label: "Hết hiệu lực", tone: "grey" },
};

export function DailyCardTable({ rows }: { rows: DailyCard[] }) {
  const table = useTableState({ rows, getRowId: (card) => card.id });
  const { pagination, visibleRows: visibleCards } = table;

  return (
    <DataTable
      empty={visibleCards.length === 0}
      className="daily-card-table"
      minWidth="var(--daily-card-table-min-width, 1620px)"
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
          <TH className="w-[100px]">Số thẻ</TH>
          <TH className="w-[150px]">Ngày nhập thẻ</TH>
          <TH className="w-[160px]">Loại phương tiện</TH>
          <TH className="w-[130px]">Mã dự án</TH>
          <TH className="w-[110px] text-center">Báo mất</TH>
          <TH className="w-[130px]">Ngày báo</TH>
          <TH className="w-[110px] text-center">Sử dụng</TH>
          <TH className="w-[140px] text-center">Số lần sử dụng</TH>
          <TH className="w-[190px]">Đã sử dụng lần cuối</TH>
          <TH sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="w-[130px] pl-3 text-left">
            Trạng thái
          </TH>
          <TH sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center" />
        </TR>
      </THead>
      <TBody>
        {visibleCards.map((card) => {
          const selected = table.selectedSet.has(card.id);
          const status = DAILY_CARD_STATUS[card.status];
          return (
            <TR key={card.id} selected={selected}>
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                onClick={() => table.selectRow(card.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => table.selectRow(card.id, checked)}
                  aria-label={`Chọn ${card.cardNumber}`}
                />
              </TD>
              <TD className="font-medium">{card.cardNumber}</TD>
              <TD>{card.importedAt}</TD>
              <TD>{card.vehicleType}</TD>
              <TD>{card.projectCode}</TD>
              <TD className="text-center">
                <TableCheckbox checked={card.lostReported} disabled aria-label="Báo mất" />
              </TD>
              <TD>{card.reportedAt}</TD>
              <TD className="text-center">
                <TableCheckbox checked={card.inUse} disabled aria-label="Sử dụng" />
              </TD>
              <TD className="text-center">{card.usageCount}</TD>
              <TD>{card.lastUsedAt}</TD>
              <TD sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="pl-3 text-left">
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </TD>
              <TD sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center">
                <TableActionDropdown actions={DAILY_CARD_ACTIONS} />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}
