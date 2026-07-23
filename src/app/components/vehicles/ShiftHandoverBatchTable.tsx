import { useMemo, useState } from "react";
import {
  TableActionDropdown,
  type TableActionDropdownItem,
} from "@/app/components/common/TableActionDropdown";
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
import type { ShiftHandoverBatch, ShiftHandoverStatus } from "@/app/types";
import { LockKeyhole, LockOpen, Pencil, Trash2 } from "lucide-react";

const ACTION_COLUMN_WIDTH = 56;

export const SHIFT_HANDOVER_STATUS: Record<ShiftHandoverStatus, StatusBadgeConfig> = {
  new: { label: "Mới tạo", tone: "blue" },
  profitCalculated: { label: "Đã tính lợi nhuận", tone: "green" },
  reportPublished: { label: "Đã phát hành báo cáo", tone: "purple" },
  locked: { label: "Đã khóa/Hoàn thành", tone: "grey" },
};

export function ShiftHandoverBatchTable({
  rows,
  onOpenDetail,
}: {
  rows: ShiftHandoverBatch[];
  onOpenDetail?: (item: ShiftHandoverBatch) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const pagination = useTablePagination({ data: rows, defaultPageSize: 10 });
  const visibleRows = pagination.paginatedData;
  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedSet.has(row.id));
  const partiallySelected =
    visibleRows.some((row) => selectedSet.has(row.id)) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    const visibleIds = visibleRows.map((row) => row.id);
    setSelectedRows((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((id) => !visibleIds.includes(id)),
    );
  };

  return (
    <DataTable
      minWidth={1580}
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
              onCheckedChange={handleSelectAll}
            />
          </TH>
          <TH className="w-[150px]">Mã giao ca</TH>
          <TH className="w-[230px]">Tên đợt giao ca</TH>
          <TH className="w-[90px]">Ca</TH>
          <TH className="w-[130px]">Ngày</TH>
          <TH className="w-[110px]">Từ giờ</TH>
          <TH className="w-[110px]">Đến giờ</TH>
          <TH className="w-[160px]">Thời gian tạo</TH>
          <TH className="w-[150px]">Người cập nhật</TH>
          <TH className="w-[190px]">Thời gian cập nhật cuối</TH>
          <TH
            className="w-[150px]"
            sticky="right"
            stickyOffset={ACTION_COLUMN_WIDTH}
            stickyOnCompact
          >
            Trạng thái
          </TH>
          <TH className="w-[56px] text-center" sticky="right" stickyOffset={0} stickyOnCompact />
        </TR>
      </THead>
      <TBody>
        {visibleRows.map((row) => {
          const selected = selectedSet.has(row.id);
          const status = SHIFT_HANDOVER_STATUS[row.status];

          return (
            <TR
              key={row.id}
              selected={selected}
              onRowDetail={() => onOpenDetail?.(row)}
              rowDetailLabel={`Xem giao ca ${row.code}`}
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
              <TD className="font-semibold text-strong">{row.code}</TD>
              <TD>{row.name}</TD>
              <TD>{row.shift}</TD>
              <TD>{row.date}</TD>
              <TD>{row.fromTime}</TD>
              <TD>{row.toTime}</TD>
              <TD>{row.createdAt}</TD>
              <TD>{row.updatedBy}</TD>
              <TD>{row.updatedAt}</TD>
              <TD sticky="right" stickyOffset={ACTION_COLUMN_WIDTH} stickyOnCompact>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </TD>
              <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact data-no-row-detail>
                <TableActionDropdown
                  detailLabel="Xem chi tiết"
                  onViewDetail={() => onOpenDetail?.(row)}
                  actions={getActionsByStatus(row.status)}
                />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}

function getActionsByStatus(status: ShiftHandoverStatus): TableActionDropdownItem[] {
  if (status === "new") {
    return [
      { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
      { id: "delete", label: "Xóa", icon: <Trash2 className="size-4" />, tone: "danger" },
    ];
  }

  if (status === "profitCalculated") {
    return [
      { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
      { id: "delete", label: "Xóa", icon: <Trash2 className="size-4" />, tone: "danger" },
      { id: "lock", label: "Khóa/Hoàn thành", icon: <LockKeyhole className="size-4" /> },
    ];
  }

  if (status === "reportPublished") {
    return [
      { id: "lock", label: "Khóa/Hoàn thành", icon: <LockKeyhole className="size-4" /> },
    ];
  }

  return [
    { id: "unlock", label: "Mở khóa", icon: <LockOpen className="size-4" /> },
  ];
}
