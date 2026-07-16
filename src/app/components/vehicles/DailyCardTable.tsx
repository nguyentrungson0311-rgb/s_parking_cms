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
import { dailyCards } from "@/app/data/dailycard";
import type { DailyCardStatus } from "@/app/types";
import { ChevronDown } from "lucide-react";

const ACTION_COLUMN_WIDTH = 84;

export const DAILY_CARD_STATUS: Record<DailyCardStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  locked: { label: "Khóa thẻ", tone: "red" },
  expired: { label: "Hết hiệu lực", tone: "grey" },
};

export function DailyCardTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    dailyCards.length > 0 && dailyCards.every((card) => selectedSet.has(card.id));
  const isSomeSelected =
    dailyCards.some((card) => selectedSet.has(card.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? dailyCards.map((card) => card.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  return (
    <DataTable
      className="daily-card-table"
      minWidth="var(--daily-card-table-min-width, 1620px)"
      footer={<TablePagination summary="1-10 of 1,248 results" />}
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
          <TH className="w-[120px]">Số thẻ</TH>
          <TH className="w-[150px]">Ngày nhập thẻ</TH>
          <TH className="w-[160px]">Loại phương tiện</TH>
          <TH className="w-[130px]">Mã dự án</TH>
          <TH className="w-[110px] text-center">Báo mất</TH>
          <TH className="w-[130px]">Ngày báo</TH>
          <TH className="w-[110px] text-center">Sử dụng</TH>
          <TH className="w-[140px] text-center">Số lần sử dụng</TH>
          <TH className="w-[190px]">Đã sử dụng lần cuối</TH>
          <TH sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="w-[160px] pl-3 text-left">
            Trạng thái
          </TH>
          <TH sticky="right" stickyOffset={0} className="w-[84px] text-center" />
        </TR>
      </THead>
      <TBody>
        {dailyCards.map((card) => {
          const selected = selectedSet.has(card.id);
          const status = DAILY_CARD_STATUS[card.status];
          return (
            <TR key={card.id} selected={selected}>
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                onClick={() => handleSelectRow(card.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => handleSelectRow(card.id, checked)}
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
              <TD sticky="right" stickyOffset={0}>
                <button
                  type="button"
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
