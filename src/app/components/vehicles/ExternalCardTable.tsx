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
import { externalCards } from "@/app/data/externalcard";
import type { ExternalCardStatus } from "@/app/types";
import { ChevronDown } from "lucide-react";

const ACTION_COLUMN_WIDTH = 84;

export const EXTERNAL_CARD_STATUS: Record<ExternalCardStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  locked: { label: "Khóa thẻ", tone: "red" },
  paymentOverdue: { label: "Quá hạn TT", tone: "yellow" },
};

export function ExternalCardTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    externalCards.length > 0 && externalCards.every((card) => selectedSet.has(card.id));
  const isSomeSelected =
    externalCards.some((card) => selectedSet.has(card.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? externalCards.map((card) => card.id) : []);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((current) =>
      checked ? [...current, id] : current.filter((rowId) => rowId !== id),
    );
  };

  return (
    <DataTable
      className="external-card-table"
      minWidth="var(--external-card-table-min-width, 2180px)"
      footer={<TablePagination summary="1-10 of 3,842 results" />}
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
          <TH className="w-[140px]">Số thẻ (LOT)</TH>
          <TH className="w-[130px]">Ngày phát thẻ</TH>
          <TH className="w-[190px]">Họ tên</TH>
          <TH className="w-[150px]">Số điện thoại</TH>
          <TH className="w-[130px]">Biển số</TH>
          <TH className="w-[170px]">Tên phương tiện</TH>
          <TH className="w-[180px]">Thời gian bắt đầu</TH>
          <TH className="w-[180px]">Thời gian kết thúc</TH>
          <TH className="w-[120px]">Loại thẻ</TH>
          <TH className="w-[120px]">Số thẻ</TH>
          <TH className="w-[150px]">Loại phương tiện</TH>
          <TH className="w-[120px]">Ngày giao</TH>
          <TH sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} className="w-[150px] pl-3 text-left">
            Trạng thái
          </TH>
          <TH sticky="right" stickyOffset={0} className="w-[84px] text-center" />
        </TR>
      </THead>
      <TBody>
        {externalCards.map((card) => {
          const selected = selectedSet.has(card.id);
          const status = EXTERNAL_CARD_STATUS[card.status];
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
                  aria-label={`Chọn ${card.lotCardNumber}`}
                />
              </TD>
              <TD className="font-medium">{card.lotCardNumber}</TD>
              <TD>{card.issuedAt}</TD>
              <TD>{card.owner}</TD>
              <TD>{card.phone}</TD>
              <TD>{card.plate}</TD>
              <TD>{card.vehicleName}</TD>
              <TD>{card.startedAt}</TD>
              <TD>{card.endedAt}</TD>
              <TD>{card.cardType}</TD>
              <TD>{card.cardNumber}</TD>
              <TD>{card.vehicleType}</TD>
              <TD>{card.deliveredAt}</TD>
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
