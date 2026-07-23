import { useState } from "react";
import { TableActionDropdown } from "@/app/components/common/TableActionDropdown";
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
  vehicleTypeRows,
  type MonthlyPricingRow,
  type PricingServiceRow,
} from "@/app/data/setting";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { Copy, Edit3, Trash2 } from "lucide-react";

export function VehicleTypeTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const pagination = useTablePagination({ data: vehicleTypeRows, defaultPageSize: 10 });
  const visibleVehicleTypes = pagination.paginatedData;
  const allSelected =
    visibleVehicleTypes.length > 0 && visibleVehicleTypes.every((row) => selectedRows.includes(row.id));
  const partiallySelected =
    visibleVehicleTypes.some((row) => selectedRows.includes(row.id)) && !allSelected;

  return (
    <DataTable
      borderless
      minWidth={900}
      noRoundedTop
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
              onCheckedChange={(checked) => {
                const visibleIds = visibleVehicleTypes.map((row) => row.id);
                setSelectedRows((current) =>
                  checked
                    ? Array.from(new Set([...current, ...visibleIds]))
                    : current.filter((id) => !visibleIds.includes(id)),
                );
              }}
            />
          </TH>
          <TH className="w-[56px]">#</TH>
          <TH className="w-[220px]">Loại phương tiện</TH>
          <TH className="w-[220px]">Nhóm xe</TH>
          <TH className="w-[180px]">Mã Loại phương tiện</TH>
          <TH className="w-[160px]">Trạng thái</TH>
        </TR>
      </THead>
      <TBody>
        {visibleVehicleTypes.map((row) => (
          <TR key={row.id} selected={selectedRows.includes(row.id)}>
            <TD className="text-center" sticky="left" stickyOffset={0}>
              <TableCheckbox
                checked={selectedRows.includes(row.id)}
                onCheckedChange={(checked) => {
                  setSelectedRows((current) =>
                    checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                  );
                }}
              />
            </TD>
            <TD>{row.id}</TD>
            <TD className="font-semibold text-strong">{row.type}</TD>
            <TD>{row.group}</TD>
            <TD>{row.code}</TD>
            <TD>
              <StatusBadge tone={getStatusBadgeTone(row.status)}>{row.status}</StatusBadge>
            </TD>
          </TR>
        ))}
      </TBody>
    </DataTable>
  );
}

export function ServicePricingTable({
  title,
  rows,
}: {
  title: string;
  rows: PricingServiceRow[];
}) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const pagination = useTablePagination({ data: rows, defaultPageSize: 10 });
  const visibleRows = pagination.paginatedData;
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id));
  const partiallySelected = visibleRows.some((row) => selectedRows.includes(row.id)) && !allSelected;

  return (
    <DataTable
      borderless
      minWidth={1810}
      noRoundedTop
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
              onCheckedChange={(checked) => {
                const visibleIds = visibleRows.map((row) => row.id);
                setSelectedRows((current) =>
                  checked
                    ? Array.from(new Set([...current, ...visibleIds]))
                    : current.filter((id) => !visibleIds.includes(id)),
                );
              }}
            />
          </TH>
          <TH className="w-[56px]">#</TH>
          <TH className="w-[190px]">Loại dịch vụ</TH>
          <TH className="w-[160px]">Loại phương tiện</TH>
          <TH className="w-[180px]">Loại hình tính phí</TH>
          <TH className="w-[140px] text-right">Đơn giá</TH>
          <TH className="w-[150px]">Ngày hiệu lực</TH>
          <TH className="w-[150px]">Ngày hết hiệu lực</TH>
          <TH className="w-[140px]">Người tạo</TH>
          <TH className="w-[190px]">Ngày tạo</TH>
          <TH className="w-[150px]">Người cập nhật</TH>
          <TH className="w-[160px]">Trạng thái</TH>
          <TH className="w-[96px] text-center" sticky="right" stickyOffset={0} stickyOnCompact>
            Thao tác
          </TH>
        </TR>
      </THead>
      <TBody>
        {visibleRows.map((row) => (
          <TR key={`${title}-${row.id}`} selected={selectedRows.includes(row.id)}>
            <TD className="text-center" sticky="left" stickyOffset={0}>
              <TableCheckbox
                checked={selectedRows.includes(row.id)}
                onCheckedChange={(checked) => {
                  setSelectedRows((current) =>
                    checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                  );
                }}
              />
            </TD>
            <TD>{row.id}</TD>
            <TD className="font-semibold text-strong">{row.service}</TD>
            <TD>{row.vehicleType}</TD>
            <TD>{row.priceType}</TD>
            <TD className="text-right font-semibold text-strong">{row.price}</TD>
            <TD>{row.effectiveDate}</TD>
            <TD>{row.expiredDate}</TD>
            <TD>{row.createdBy}</TD>
            <TD>{row.createdAt}</TD>
            <TD>{row.updatedBy}</TD>
            <TD>
              <StatusBadge tone={getStatusBadgeTone(row.status)}>{row.status}</StatusBadge>
            </TD>
            <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact>
              <TableActionDropdown
                detailLabel="Xem"
                actions={[
                  { id: "edit", label: "Chỉnh sửa", icon: <Edit3 className="size-4" /> },
                  { id: "duplicate", label: "Nhân bản", icon: <Copy className="size-4" /> },
                  { id: "delete", label: "Xóa", icon: <Trash2 className="size-4" />, tone: "danger" },
                ]}
              />
            </TD>
          </TR>
        ))}
      </TBody>
    </DataTable>
  );
}

export function MonthlyServicePricingTable({
  rows,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  rows: MonthlyPricingRow[];
  onOpenDetail: (row: MonthlyPricingRow) => void;
  onEdit: (row: MonthlyPricingRow) => void;
  onDuplicate: (row: MonthlyPricingRow) => void;
  onDelete: (row: MonthlyPricingRow) => void;
}) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const pagination = useTablePagination({ data: rows, defaultPageSize: 10 });
  const visibleRows = pagination.paginatedData;
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id));
  const partiallySelected = visibleRows.some((row) => selectedRows.includes(row.id)) && !allSelected;

  return (
    <DataTable
      borderless
      minWidth={1510}
      noRoundedTop
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
              onCheckedChange={(checked) => {
                const visibleIds = visibleRows.map((row) => row.id);
                setSelectedRows((current) =>
                  checked
                    ? Array.from(new Set([...current, ...visibleIds]))
                    : current.filter((id) => !visibleIds.includes(id)),
                );
              }}
            />
          </TH>
          <TH className="w-[56px]">#</TH>
          <TH className="w-[190px]">Loại dịch vụ</TH>
          <TH className="w-[180px]">Loại hình tính phí</TH>
          <TH className="w-[150px]">Ngày hiệu lực</TH>
          <TH className="w-[150px]">Ngày hết hiệu lực</TH>
          <TH className="w-[140px]">Người tạo</TH>
          <TH className="w-[190px]">Ngày tạo</TH>
          <TH className="w-[150px]">Người cập nhật</TH>
          <TH className="w-[160px]">Trạng thái</TH>
          <TH className="w-[96px] text-center" sticky="right" stickyOffset={0} stickyOnCompact>
            Thao tác
          </TH>
        </TR>
      </THead>
      <TBody>
        {visibleRows.map((row) => (
          <TR
            key={`monthly-${row.id}`}
            selected={selectedRows.includes(row.id)}
            onRowDetail={() => onOpenDetail(row)}
            rowDetailLabel={`Xem chi tiết ${row.service}`}
          >
            <TD className="text-center" sticky="left" stickyOffset={0} data-no-row-detail>
              <TableCheckbox
                checked={selectedRows.includes(row.id)}
                onCheckedChange={(checked) => {
                  setSelectedRows((current) =>
                    checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                  );
                }}
              />
            </TD>
            <TD>{row.id}</TD>
            <TD className="font-semibold text-strong">{row.service}</TD>
            <TD>{row.priceType}</TD>
            <TD>{row.effectiveDate}</TD>
            <TD>{row.expiredDate}</TD>
            <TD>{row.createdBy}</TD>
            <TD>{row.createdAt}</TD>
            <TD>{row.updatedBy}</TD>
            <TD>
              <StatusBadge tone={getStatusBadgeTone(row.status)}>{row.status}</StatusBadge>
            </TD>
            <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact data-no-row-detail>
              <TableActionDropdown
                detailLabel="Xem"
                onViewDetail={() => onOpenDetail(row)}
                actions={[
                  {
                    id: "edit",
                    label: "Chỉnh sửa",
                    icon: <Edit3 className="size-4" />,
                    onSelect: () => onEdit(row),
                  },
                  {
                    id: "duplicate",
                    label: "Nhân bản",
                    icon: <Copy className="size-4" />,
                    onSelect: () => onDuplicate(row),
                  },
                  {
                    id: "delete",
                    label: "Xóa",
                    icon: <Trash2 className="size-4" />,
                    tone: "danger",
                    onSelect: () => onDelete(row),
                  },
                ]}
              />
            </TD>
          </TR>
        ))}
      </TBody>
    </DataTable>
  );
}

function getStatusBadgeTone(status: string) {
  if (status === "Đang sử dụng") return "green";
  if (status === "Chưa sử dụng") return "grey";
  return "red";
}
