import { useState } from "react";
import { ShiftAssignTable } from "@/app/components/vehicles/ShiftAssignTable";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  DataTable,
  TablePagination,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/app/components/ui/table";
import type { ShiftSlotRow, ShiftSlotView } from "@/app/data/shifthandoverdetail";
import { useTableState } from "@/app/hooks/useTableState";
import type { ShiftAssign } from "@/app/types";
import { cn } from "@/lib/utils";
import { BarChart3, FileCheck2 } from "lucide-react";

const PROFIT_VEHICLE_TYPES: ShiftAssign["vehicleType"][] = [
  "Ô tô",
  "Xe máy",
  "Xe máy điện",
  "Xe đạp",
];

export function ShiftHandoverTicketTable({
  rows,
  ticketType,
  onOpenDetail,
}: {
  rows: ShiftAssign[];
  ticketType: ShiftAssign["ticketType"];
  onOpenDetail: (item: ShiftAssign) => void;
}) {
  return (
    <ShiftAssignTable
      embedded
      rows={rows}
      ticketType={ticketType}
      onOpenDetail={onOpenDetail}
    />
  );
}

export function ShiftSlotOverview({
  rows,
  view,
  onApplyTotalSlots,
}: {
  rows: ShiftSlotRow[];
  view: ShiftSlotView;
  onApplyTotalSlots: (id: string, totalSlots: number) => void;
}) {
  return (
    <div className="h-full min-h-0 min-w-0 overflow-hidden">
      {view === "table" ? (
        <SlotOverviewTable rows={rows} />
      ) : (
        <SlotStatisticGrid rows={rows} onApplyTotalSlots={onApplyTotalSlots} />
      )}
    </div>
  );
}

export function ShiftHandoverProfitSummary({
  rows,
  finalizedTicketTypes,
}: {
  rows: ShiftAssign[];
  finalizedTicketTypes: ShiftAssign["ticketType"][];
}) {
  const finalizedRows = rows.filter(
    (row) => row.status === "exited" && finalizedTicketTypes.includes(row.ticketType),
  );
  const summaryRows = PROFIT_VEHICLE_TYPES.map((vehicleType) => {
    const vehicleRows = finalizedRows.filter((row) => row.vehicleType === vehicleType);
    const revenue = vehicleRows.reduce((total, row) => total + parseCurrency(row.payment), 0);

    return {
      vehicleType,
      count: vehicleRows.length,
      revenue,
    };
  });
  const totalRevenue = summaryRows.reduce((total, row) => total + row.revenue, 0);

  if (finalizedTicketTypes.length === 0) {
    return <ProfitEmptyState />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto">
      <div className="flex shrink-0 items-center gap-3">
        <BarChart3 className="size-5 text-theme" />
        <h3 className="min-w-0 text-[clamp(16px,4vw,20px)] font-semibold leading-6 text-strong">
          Tổng hợp lợi nhuận theo loại xe đã ra
        </h3>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryRows.map((row) => (
          <div
            key={row.vehicleType}
            className="min-w-0 rounded-md border border-border bg-surface p-3 sm:p-4"
          >
            <div className="min-w-0 truncate text-xs font-semibold text-muted sm:text-sm">{row.vehicleType}</div>
            <div className="mt-2 min-w-0 truncate text-[clamp(18px,5vw,30px)] font-semibold leading-tight text-strong sm:mt-3">
              {formatCurrency(row.revenue)}
            </div>
            <div className="mt-2 min-w-0 truncate text-xs font-medium text-muted sm:text-sm">
              {formatNumber(row.count)} xe đã ra
            </div>
          </div>
        ))}
      </div>

      <div className="shrink-0 rounded-md border border-border bg-surface p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <div className="text-sm font-semibold text-muted">Tổng lợi nhuận tạm tính</div>
            <div className="mt-2 min-w-0 truncate text-[clamp(20px,6vw,30px)] font-semibold leading-tight text-strong">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          <div className="rounded-md bg-theme-soft px-3 py-2 text-sm font-semibold text-theme">
            Đã chốt {finalizedTicketTypes.length}/3 nhóm vé
          </div>
        </div>
      </div>

      <div className="min-h-[280px] min-w-0 flex-1 overflow-hidden">
        <FinalizedExitedVehicleTable rows={finalizedRows} />
      </div>
    </div>
  );
}

function ProfitEmptyState() {
  return (
    <div className="grid h-full min-h-[360px] place-items-center p-6 text-center">
      <div className="max-w-[420px]">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-theme-soft text-theme">
          <FileCheck2 className="size-7" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-strong">
          Chưa có dữ liệu lợi nhuận
        </h3>
        <p className="mt-2 text-sm leading-5 text-muted">
          Chốt phương tiện ở Vé tháng, Vé ngày hoặc Vé ngoài để tổng hợp xe đã ra và tính lợi nhuận theo loại xe.
        </p>
      </div>
    </div>
  );
}

function FinalizedExitedVehicleTable({ rows }: { rows: ShiftAssign[] }) {
  const table = useTableState({ rows, getRowId: (row) => row.id });
  const { pagination, visibleRows } = table;

  return (
    <DataTable
      minWidth={1160}
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
          <TH className="w-[120px] pl-4">Mã(#)</TH>
          <TH className="w-[120px]">Loại vé</TH>
          <TH className="w-[150px]">Loại phương tiện</TH>
          <TH className="w-[160px]">Biển số</TH>
          <TH className="w-[190px]">Khách hàng</TH>
          <TH className="w-[170px]">Ngày ra</TH>
          <TH className="w-[130px] text-right">Doanh thu</TH>
          <TH className="w-[130px] text-center">Trạng thái</TH>
        </TR>
      </THead>
      <TBody>
        {visibleRows.length === 0 ? (
          <TR>
            <TD colSpan={8} className="h-24 text-center text-muted">
              Chưa có xe đã ra trong các nhóm vé đã chốt.
            </TD>
          </TR>
        ) : (
          visibleRows.map((row) => (
            <TR key={`profit-${row.id}`}>
              <TD className="pl-4 font-medium text-strong">{row.lotCardNumber}</TD>
              <TD>{row.ticketType}</TD>
              <TD>{row.vehicleType}</TD>
              <TD>{row.plate}</TD>
              <TD>{row.customer}</TD>
              <TD>{row.checkedOutAt}</TD>
              <TD className="text-right font-semibold text-strong">
                {formatCurrency(parseCurrency(row.payment))}
              </TD>
              <TD className="text-center">
                <span className="inline-flex items-center rounded-[8px] bg-green-soft px-2 py-1.5 text-sm font-medium leading-none text-green">
                  Đã chốt
                </span>
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </DataTable>
  );
}

function SlotOverviewTable({ rows }: { rows: ShiftSlotRow[] }) {
  return (
    <DataTable borderless empty={rows.length === 0} noRoundedTop noRoundedLeft minWidth={1120}>
      <THead>
        <TR>
          <TH className="w-[180px] pl-4">Loại phương tiện</TH>
          <TH className="w-[100px]">Tổng Slot</TH>
          <TH className="w-[170px]">Tổng trong bãi đầu ca</TH>
          <TH className="w-[170px]">Tổng trong bãi cuối ca</TH>
          <TH className="w-[120px]">Vé tháng</TH>
          <TH className="w-[120px]">Vé ngày</TH>
          <TH className="w-[150px]">Còn trống (bàn giao)</TH>
          <TH className="w-[100px] text-center">Thao tác</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((row) => {
          const closingInside = row.monthlyInside + row.dailyInside;
          const handoverAvailable = Math.max(0, row.totalSlots - closingInside);
          const availableRatio = row.totalSlots > 0 ? handoverAvailable / row.totalSlots : 0;
          const danger = availableRatio < 0.24;

          return (
            <TR key={row.id}>
              <TD>
                <div className="flex items-center gap-3 pl-2">
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", row.toneClass)}>
                    <SlotVehicleIcon icon={row.icon} />
                  </span>
                  <span className="font-semibold text-strong">{row.vehicleType}</span>
                </div>
              </TD>
              <TD className="font-semibold">{formatNumber(row.totalSlots)}</TD>
              <TD>{formatNumber(row.openingInside)}</TD>
              <TD className="font-semibold">{formatNumber(closingInside)}</TD>
              <TD>{formatNumber(row.monthlyInside)}</TD>
              <TD>{formatNumber(row.dailyInside)}</TD>
              <TD>
                <div className="flex items-center gap-2">
                  <span className={cn("min-w-10 font-semibold", danger ? "text-destructive" : "text-green")}>
                    {formatNumber(handoverAvailable)}
                  </span>
                  <span className="h-1.5 w-16 overflow-hidden rounded-full bg-green-soft">
                    <span
                      className={cn("block h-full rounded-full", danger ? "bg-destructive" : "bg-green")}
                      style={{ width: `${Math.max(8, availableRatio * 100)}%` }}
                    />
                  </span>
                </div>
              </TD>
              <TD className="text-center">
                <Button variant="outline" size="sm">
                  Sửa Slot
                </Button>
              </TD>
            </TR>
          );
        })}
      </TBody>
    </DataTable>
  );
}

function SlotStatisticGrid({
  rows,
  onApplyTotalSlots,
}: {
  rows: ShiftSlotRow[];
  onApplyTotalSlots: (id: string, totalSlots: number) => void;
}) {
  return (
    <div className="grid h-full min-h-0 w-full min-w-0 max-w-full auto-rows-auto grid-cols-1 items-start gap-3 overflow-auto md:auto-rows-fr md:grid-cols-2 md:items-stretch md:gap-4">
      {rows.map((row) => (
        <SlotStatisticCard key={row.id} row={row} onApplyTotalSlots={onApplyTotalSlots} />
      ))}
    </div>
  );
}

function SlotStatisticCard({
  row,
  onApplyTotalSlots,
}: {
  row: ShiftSlotRow;
  onApplyTotalSlots: (id: string, totalSlots: number) => void;
}) {
  const [draftTotalSlots, setDraftTotalSlots] = useState("");
  const closingInside = row.monthlyInside + row.dailyInside;
  const handoverAvailable = Math.max(0, row.totalSlots - closingInside);
  const filledPercent =
    row.totalSlots > 0 ? Math.min(100, Math.round((closingInside / row.totalSlots) * 100)) : 0;
  const handleApply = () => {
    const nextTotalSlots = Number(draftTotalSlots.replace(/[^\d]/g, ""));
    if (!Number.isFinite(nextTotalSlots) || nextTotalSlots <= 0) return;
    onApplyTotalSlots(row.id, nextTotalSlots);
    setDraftTotalSlots("");
  };

  return (
    <div className="flex h-auto w-full min-w-0 max-w-full flex-col self-start overflow-visible rounded-md border border-border bg-surface p-3 md:h-full md:min-h-[260px] md:self-stretch md:overflow-hidden md:p-4">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-[8px] md:size-10", row.toneClass)}>
          <SlotVehicleIcon icon={row.icon} />
        </span>
        <h4 className="min-w-0 truncate text-[clamp(18px,5vw,20px)] font-semibold leading-6 text-strong">{row.vehicleType}</h4>
      </div>

      <Input
        className="mt-3 h-10 rounded-[8px] md:mt-4 md:h-12"
        inputMode="numeric"
        placeholder="Tổng Slot mới"
        value={draftTotalSlots}
        onChange={(event) => setDraftTotalSlots(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleApply();
        }}
        rightAction={
          <Button variant="outline-primary" size="md" className="h-8 shrink-0 px-3 md:h-9" onClick={handleApply}>
            Áp dụng
          </Button>
        }
      />

      <div className="mt-3 grid w-full min-w-0 grid-cols-[minmax(88px,96px)_minmax(0,1fr)] items-center gap-3 md:mt-5 md:flex-1 md:grid-cols-[minmax(128px,0.85fr)_minmax(0,1fr)] md:gap-4">
        <div className="grid min-w-0 place-items-center">
          <div
            className="grid size-24 place-items-center rounded-full md:size-32 2xl:size-36"
            style={{
              background: `conic-gradient(${row.fillColor} ${filledPercent}%, ${row.softColor} 0)`,
            }}
          >
            <div className="grid size-16 place-items-center rounded-full bg-surface text-center md:size-22 2xl:size-24">
              <div>
                <div className="text-lg font-semibold text-strong">{filledPercent}%</div>
                <div className="text-xs font-bold uppercase text-muted">Lấp đầy</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0 space-y-1.5 md:space-y-2.5">
          <SlotMetric label="Tổng Slot hiện tại" value={row.totalSlots} strong />
          <SlotMetric label="Vé tháng" value={row.monthlyInside} />
          <SlotMetric label="Vé ngày" value={row.dailyInside} />
          <SlotMetric label="Còn trống (bàn giao)" value={handoverAvailable} tone="available" />
        </div>
      </div>
    </div>
  );
}

function SlotMetric({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: number;
  strong?: boolean;
  tone?: "available";
}) {
  return (
    <div className="grid min-h-7 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:min-h-8 md:gap-4">
      <span className="min-w-0 truncate text-sm font-regular leading-5 text-text md:text-base md:leading-6">{label}</span>
      <span
        className={cn(
          "shrink-0 text-right text-sm font-semibold leading-5 md:text-base md:leading-6",
          tone === "available" ? "text-green" : strong ? "text-strong" : "text-text",
        )}
      >
        {formatNumber(value)}
      </span>
    </div>
  );
}

function SlotVehicleIcon({ icon }: { icon: ShiftSlotRow["icon"] }) {
  if (icon === "two_wheeler") {
    return <MaterialTwoWheelerIcon className="size-5" />;
  }

  if (icon === "pedal_bike") {
    return <MaterialPedalBikeIcon className="size-5" />;
  }

  return <i className={cn("text-lg leading-none", icon)} aria-hidden="true" />;
}

function MaterialTwoWheelerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M20 11c-.18 0-.36.03-.53.05L17.41 9H20V6l-3.72 1.86L13.41 5H9v2h3.59l2 2H11l-4 2-2-2H0v2h4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4l2 2h3l3.49-6.1 1.01 1.01c-.91.73-1.5 1.84-1.5 3.09 0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4zM4 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm16 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
      />
    </svg>
  );
}

function MaterialPedalBikeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m18.18 10-1.7-4.68A2.008 2.008 0 0 0 14.6 4H12v2h2.6l1.46 4h-4.81l-.36-1H12V7H7v2h1.75l1.82 5H9.9c-.44-2.23-2.31-3.88-4.65-3.99C2.45 9.87 0 12.2 0 15c0 2.8 2.2 5 5 5 2.46 0 4.45-1.69 4.9-4h4.2c.44 2.23 2.31 3.88 4.65 3.99 2.8.13 5.25-2.19 5.25-5 0-2.8-2.2-5-5-5h-.82zM7.82 16c-.4 1.17-1.49 2-2.82 2-1.68 0-3-1.32-3-3s1.32-3 3-3c1.33 0 2.42.83 2.82 2H5v2h2.82zm6.28-2h-1.4l-.73-2H15c-.44.58-.76 1.25-.9 2zm4.9 4c-1.68 0-3-1.32-3-3 0-.93.41-1.73 1.05-2.28l.96 2.64 1.88-.68-.97-2.67c.03 0 .06-.01.09-.01 1.68 0 3 1.32 3 3s-1.33 3-3.01 3z" />
    </svg>
  );
}

function parseCurrency(value: string) {
  const amount = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function formatCurrency(value: number) {
  return `${formatNumber(value)}đ`;
}

function formatNumber(value: number) {
  return value.toLocaleString("vi-VN");
}
