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
import { externalCards } from "@/app/data/externalcard";
import type { ExternalCardStatus } from "@/app/types";
import { Lock, Pencil, Unlock } from "lucide-react";

const ACTION_COLUMN_WIDTH = 56;

const EXTERNAL_CARD_ACTIONS: TableActionDropdownItem[] = [
  { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
  { id: "lock-card", label: "Khóa thẻ", icon: <Lock className="size-4" />, tone: "danger" },
  { id: "unlock-card", label: "Mở thẻ", icon: <Unlock className="size-4" /> },
];

export const EXTERNAL_CARD_STATUS: Record<ExternalCardStatus, StatusBadgeConfig> = {
  active: { label: "Đang hoạt động", tone: "green" },
  locked: { label: "Khóa thẻ", tone: "red" },
  paymentOverdue: { label: "Quá hạn TT", tone: "yellow" },
};

export function ExternalCardTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const pagination = useTablePagination({ data: externalCards, defaultPageSize: 10 });
  const visibleCards = pagination.paginatedData;
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    visibleCards.length > 0 && visibleCards.every((card) => selectedSet.has(card.id));
  const isSomeSelected =
    visibleCards.some((card) => selectedSet.has(card.id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    const visibleIds = visibleCards.map((card) => card.id);
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
      className="external-card-table"
      minWidth="var(--external-card-table-min-width, 2180px)"
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
            onClick={() => handleSelectAll(!isAllSelected)}
          >
            <TableCheckbox
              checked={isAllSelected}
              indeterminate={isSomeSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Chọn tất cả"
            />
          </TH>
          <TH className="w-[60px]">Mã(#)</TH>
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
          <TH sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center" />
        </TR>
      </THead>
      <TBody>
        {visibleCards.map((card) => {
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
              <TD sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center">
                <TableActionDropdown actions={EXTERNAL_CARD_ACTIONS} />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}
