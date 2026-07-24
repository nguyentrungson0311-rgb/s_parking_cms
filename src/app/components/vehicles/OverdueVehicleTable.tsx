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
import type { OverdueVehicle } from "@/app/types";
import { LogOut, Pencil } from "lucide-react";

const OVERDUE_VEHICLE_ACTIONS: TableActionDropdownItem[] = [
  { id: "edit", label: "Sửa", icon: <Pencil className="size-4" /> },
  { id: "release-vehicle", label: "Cho xe ra khỏi bãi", icon: <LogOut className="size-4" /> },
];

export function OverdueVehicleTable({ rows }: { rows: OverdueVehicle[] }) {
  const table = useTableState({ rows, getRowId: (item) => item.id });
  const { pagination, visibleRows: visibleOverdueVehicles } = table;

  return (
    <DataTable
      empty={visibleOverdueVehicles.length === 0}
      className="overdue-vehicle-table"
      minWidth="var(--overdue-vehicle-table-min-width, 2360px)"
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
          <TH className="w-[100px]">Mã(#)</TH>
          <TH className="w-[130px]">Số vé</TH>
          <TH className="w-[130px]">Mã thẻ</TH>
          <TH className="w-[160px]">Loại phương tiện</TH>
          <TH className="w-[120px]">Loại vé</TH>
          <TH className="w-[170px]">Ngày vào</TH>
          <TH className="w-[140px]">Ảnh biển</TH>
          <TH className="w-[150px]">Ảnh tổng quan</TH>
          <TH className="w-[150px]">Chữ nhận diện</TH>
          <TH className="w-[190px]">Họ tên</TH>
          <TH className="w-[120px]">Căn hộ</TH>
          <TH className="w-[180px]">Tên phương tiện</TH>
          <TH className="w-[140px]">Biển số</TH>
          <TH className="w-[110px] text-center">Số ngày</TH>
          <TH sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center" />
        </TR>
      </THead>
      <TBody>
        {visibleOverdueVehicles.map((item) => {
          const selected = table.selectedSet.has(item.id);

          return (
            <TR key={item.id} selected={selected}>
              <TD
                sticky="left"
                stickyOffset={0}
                className="w-10 cursor-pointer"
                onClick={() => table.selectRow(item.id, !selected)}
              >
                <TableCheckbox
                  checked={selected}
                  onCheckedChange={(checked) => table.selectRow(item.id, checked)}
                  aria-label={`Chọn ${item.lotCardNumber}`}
                />
              </TD>
              <TD className="font-medium">{item.lotCardNumber}</TD>
              <TD>{item.ticketNumber}</TD>
              <TD>{item.cardCode}</TD>
              <TD>{item.vehicleType}</TD>
              <TD>{item.ticketType}</TD>
              <TD>{item.checkedInAt}</TD>
              <TD>
                <VehicleImageThumb label={item.plateImageLabel} variant="plate" />
              </TD>
              <TD>
                <VehicleImageThumb label={item.overviewImageLabel} variant="overview" />
              </TD>
              <TD>{item.recognitionText}</TD>
              <TD>{item.customerName}</TD>
              <TD>{item.apartment}</TD>
              <TD>{item.vehicleName}</TD>
              <TD className="font-medium">{item.plate}</TD>
              <TD className="text-center">
                <span className="inline-flex min-w-12 justify-center rounded-[8px] bg-[var(--sp-orange-soft)] px-2 py-1 font-semibold text-[var(--sp-orange)]">
                  {item.overdueDays}
                </span>
              </TD>
              <TD sticky="right" stickyOffset={0} stickyOnCompact className="w-[56px] px-1 text-center">
                <TableActionDropdown actions={OVERDUE_VEHICLE_ACTIONS} />
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}

function VehicleImageThumb({
  label,
  variant,
}: {
  label: OverdueVehicle["plateImageLabel"];
  variant: "plate" | "overview";
}) {
  return (
    <div
      className="flex h-10 w-[118px] items-center justify-center overflow-hidden rounded-[8px] border border-[var(--sp-border)] bg-[var(--sp-theme-soft)] px-2 text-center text-xs font-semibold leading-4 text-[var(--sp-strong)]"
      aria-label={variant === "plate" ? "Ảnh biển số" : "Ảnh tổng quan"}
    >
      {label}
    </div>
  );
}
