import { useMemo, useState } from "react";
import { MainTableCard } from "@/app/components/common/MainTableCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import {
  DataTable,
  TABLE_SELECTION_COLUMN_WIDTH,
  TableCheckbox,
  TablePagination,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/app/components/ui/table";
import { InputDate, InputSelect, SearchInput, type DropdownOption } from "@/app/components/ui/input";
import { useTableQuery } from "@/app/hooks/useTableQuery";
import { useTableState } from "@/app/hooks/useTableState";
import { cn } from "@/lib/utils";
import { Download, Eye, FileText, ListFilter, Save, SearchX } from "lucide-react";

type MonthlyReportRow = {
  id: string;
  date: string;
  shift: "Ca 1" | "Ca 2";
  startedAt: string;
  endedAt: string;
  checkInCount: number;
  checkOutCount: number;
  vehicleCount: number;
  lostCardCount: number;
  lostCardTotal: string;
  totalIncome: string;
};

const reportMenu = [
  { id: "monthly", title: "Báo cáo tháng", description: "Tổng hợp theo ngày và ca" },
  { id: "revenue", title: "Báo cáo doanh thu", description: "Tổng hợp doanh thu bãi xe" },
  { id: "traffic", title: "Báo cáo lượt xe", description: "Số lượt vào ra theo ca" },
  { id: "lost-card", title: "Báo cáo mất thẻ", description: "Thống kê phí mất thẻ" },
  { id: "vehicle", title: "Báo cáo phương tiện", description: "Tổng hợp số phương tiện" },
  { id: "shift", title: "Báo cáo giao ca", description: "Tổng hợp vận hành ca" },
];

const reportPeriodOptions: DropdownOption[] = [
  { value: "day", label: "Theo ngày" },
  { value: "week", label: "Theo tuần" },
  { value: "month", label: "Theo tháng" },
  { value: "quarter", label: "Theo quý" },
  { value: "year", label: "Theo năm" },
];

const monthlyReportPageSizeOptions = [10, 30, 50, 100];
const monthlyReportSearchFields: Array<keyof MonthlyReportRow> = [
  "date",
  "shift",
  "startedAt",
  "endedAt",
  "totalIncome",
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function formatDate(day: number) {
  return `${String(day).padStart(2, "0")}/07/2026`;
}

function makeShiftTime(day: number, shiftIndex: number) {
  const startHour = shiftIndex === 0 ? 6 : 18;
  const endHour = shiftIndex === 0 ? 18 : 6;
  const startMinute = (day * 7 + shiftIndex * 11) % 60;
  const startSecond = (day * 13 + shiftIndex * 17) % 60;
  const startMs = 100 + ((day * 37 + shiftIndex * 211) % 900);
  const endMinute = (startMinute + 2 + ((day + shiftIndex) % 9)) % 60;
  const endSecond = (startSecond + 5 + ((day * 3 + shiftIndex) % 11)) % 60;
  const endMs = 100 + ((startMs + day * 19 + shiftIndex * 83) % 900);
  const startedAt = `${String(startHour).padStart(2, "0")}:${String(startMinute).padStart(2, "0")}:${String(startSecond).padStart(2, "0")}.${String(startMs).padStart(3, "0")}`;
  const endedAt = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:${String(endSecond).padStart(2, "0")}.${String(endMs).padStart(3, "0")}`;

  return {
    shift: shiftIndex === 0 ? ("Ca 1" as const) : ("Ca 2" as const),
    startedAt,
    endedAt,
  };
}

function makeMonthlyReportRows(): MonthlyReportRow[] {
  return Array.from({ length: 15 }, (_, dayIndex) => {
    const day = dayIndex + 1;
    const date = formatDate(day);

    return [0, 1].map((shiftIndex) => {
      const shift = makeShiftTime(day, shiftIndex);
      const checkInCount = 118 + day * 3 + shiftIndex * 17;
      const checkOutCount = 109 + day * 2 + shiftIndex * 19;
      const vehicleCount = Math.max(checkInCount, checkOutCount) - 8;
      const lostCardCount = (day + shiftIndex) % 4;
      const lostCardFee = lostCardCount * 150000;
      const totalIncome = 6800000 + day * 185000 + shiftIndex * 920000 + lostCardFee;

      return {
        id: `${date}-${shift.shift}`,
        date,
        shift: shift.shift,
        startedAt: shift.startedAt,
        endedAt: shift.endedAt,
        checkInCount,
        checkOutCount,
        vehicleCount,
        lostCardCount,
        lostCardTotal: formatCurrency(lostCardFee),
        totalIncome: formatCurrency(totalIncome),
      };
    });
  }).flat();
}

function ReportEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid h-full min-h-[360px] place-items-center px-6 text-center">
      <div className="max-w-[460px]">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sp-grey-soft)] text-[var(--sp-muted)]">
          <FileText className="size-8" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[var(--sp-strong)]">{title}</h3>
        <p className="mt-2 text-base text-[var(--sp-muted)]">{description}</p>
        <p className="mt-3 text-base text-[var(--sp-muted)]">
          Chọn tham số thời gian và nhấn <span className="font-semibold text-[var(--sp-strong)]">Lọc</span> để xem dữ liệu.
        </p>
      </div>
    </div>
  );
}

function ReportNoDataState({
  title,
}: {
  title: string;
}) {
  return (
    <div className="grid h-full min-h-[360px] place-items-center px-6 text-center">
      <div className="max-w-[420px]">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sp-grey-soft)] text-[var(--sp-muted)]">
          <SearchX className="size-8" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[var(--sp-strong)]">Không có dữ liệu</h3>
        <p className="mt-2 text-base text-[var(--sp-muted)]">
          Không tìm thấy dữ liệu cho {title.toLowerCase()} với điều kiện lọc hiện tại.
        </p>
      </div>
    </div>
  );
}

export function MonthlyReport() {
  const rows = useMemo(() => makeMonthlyReportRows(), []);
  const [searchReport, setSearchReport] = useState("");
  const [activeReport, setActiveReport] = useState("monthly");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [period, setPeriod] = useState("day");
  const [selectedDate, setSelectedDate] = useState("2026-07-01");
  const activeReportConfig = reportMenu.find((report) => report.id === activeReport) ?? reportMenu[0];
  const displayRows = activeReport === "monthly" ? rows : [];
  const reportQuery = useTableQuery({
    rows: displayRows,
    searchFields: monthlyReportSearchFields,
  });
  const table = useTableState({
    rows: reportQuery.filteredRows,
    getRowId: (row) => row.id,
    defaultPageSize: 30,
  });
  const { pagination, visibleRows } = table;
  const filteredReports = reportMenu.filter((report) => {
    const keyword = searchReport.toLowerCase();
    return (
      report.title.toLowerCase().includes(keyword) ||
      report.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="sp-page">
      <Topbar
        title="Tổng hợp"
        breadcrumbs={["Home page", "Tổng hợp", "Báo cáo tháng"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="grid h-full min-h-0 min-w-0 grid-cols-[300px_minmax(0,1fr)] gap-4 overflow-hidden max-xl:grid-cols-1 max-xl:grid-rows-[auto_minmax(0,1fr)] max-xl:content-start max-xl:gap-2">
          <aside className="sp-card-borderless flex min-h-0 flex-col overflow-hidden rounded-[14px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-3 shadow-[var(--shadow-panel)] max-xl:p-2">
            <SearchInput
              className="h-10 shrink-0 max-xl:hidden"
              placeholder="Tìm kiếm báo cáo..."
              value={searchReport}
              onChange={(event) => setSearchReport(event.target.value)}
            />

            <div className="mt-3 grid min-h-0 gap-1 overflow-y-auto max-xl:mt-0 max-xl:flex max-xl:gap-2 max-xl:overflow-x-auto max-xl:overflow-y-hidden">
              {filteredReports.map((report, index) => {
                const active = activeReport === report.id;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => {
                      setActiveReport(report.id);
                      setHasFiltered(false);
                      table.setSelectedRows([]);
                      pagination.setPage(1);
                    }}
                    className={cn(
                      "relative flex w-full gap-3 rounded-md border-l-4 px-3 py-3 text-left transition-colors max-xl:min-h-9 max-xl:w-auto max-xl:shrink-0 max-xl:items-center max-xl:border-l-0 max-xl:border-b-2 max-xl:px-3 max-xl:py-2",
                      active
                        ? "border-l-[var(--sp-theme)] bg-[var(--accent)] max-xl:border-b-[var(--sp-theme)]"
                        : "border-l-transparent hover:bg-[var(--accent)] max-xl:border-b-transparent",
                    )}
                  >
                    <span className="w-5 shrink-0 pt-0.5 text-sm font-medium text-[var(--sp-muted)] max-xl:hidden">
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-base font-medium max-xl:max-w-[150px] max-xl:text-sm",
                          active ? "text-[var(--sp-theme)]" : "text-[var(--sp-strong)]",
                        )}
                      >
                        {report.title}
                      </span>
                      <span className="mt-1 block truncate text-sm text-[var(--sp-muted)] max-xl:hidden">
                        {report.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="min-h-0 min-w-0 overflow-hidden">
            <MainTableCard
              className="monthly-report-card gap-2 p-3"
              title={activeReportConfig.title}
              searchValue={reportQuery.search}
              onSearchChange={reportQuery.setSearch}
              actions={
                <>
                  <InputSelect
                    wrapperClassName="w-[160px]"
                    options={reportPeriodOptions}
                    value={period}
                    onValueChange={setPeriod}
                  />
                  <InputDate
                    wrapperClassName="w-[170px]"
                    value={selectedDate}
                    onValueChange={setSelectedDate}
                  />
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setHasFiltered(true);
                      table.setSelectedRows([]);
                      pagination.setPage(1);
                    }}
                  >
                    <ListFilter />
                    Lọc
                  </Button>
                  <Button size="md" disabled={!hasFiltered || reportQuery.filteredRows.length === 0}>
                    <Save />
                    Lưu
                  </Button>
                </>
              }
            >
              {!hasFiltered ? (
                <ReportEmptyState
                  title={activeReportConfig.title}
                  description={activeReportConfig.description}
                />
              ) : reportQuery.filteredRows.length === 0 ? (
                <ReportNoDataState title={activeReportConfig.title} />
              ) : (
                <div className="flex h-full min-h-0 min-w-0 flex-col">
                  <DataTable
                    minWidth={1540}
                    footer={
                      <TablePagination
                        page={pagination.page}
                        pageSize={pagination.pageSize}
                        totalItems={pagination.totalItems}
                        onPageChange={pagination.setPage}
                        onPageSizeChange={pagination.setPageSize}
                        pageSizeOptions={monthlyReportPageSizeOptions}
                      />
                    }
                  >
              <THead>
                <TR>
                  <TH className="w-10 text-center" sticky="left" stickyOffset={0}>
                    <TableCheckbox
                      checked={table.allSelected}
                      indeterminate={table.partiallySelected}
                      onCheckedChange={(checked) => {
                        table.selectAllVisible(checked);
                      }}
                    />
                  </TH>
                  <TH className="w-[64px]" sticky="left" stickyOffset={TABLE_SELECTION_COLUMN_WIDTH}>#</TH>
                  <TH className="w-[130px]">Ngày vào</TH>
                  <TH className="w-[92px]">Ca</TH>
                  <TH className="w-[150px]">Thời gian bắt đầu</TH>
                  <TH className="w-[140px]">Thời gian ra</TH>
                  <TH className="w-[120px] text-right">Số lần vào</TH>
                  <TH className="w-[120px] text-right">Số lần ra</TH>
                  <TH className="w-[140px] text-right">Số phương tiện</TH>
                  <TH className="w-[150px] text-right">Số lần mất thẻ</TH>
                  <TH className="w-[150px] text-right">Tổng số mất thẻ</TH>
                  <TH className="w-[150px] text-right">Tổng thu nhập</TH>
                  <TH className="w-[120px] text-center" sticky="right" stickyOffset={0} stickyOnCompact>Thao tác</TH>
                </TR>
              </THead>
              <TBody>
                {visibleRows.map((row, index) => {
                  const selected = table.selectedSet.has(row.id);

                  return (
                    <TR key={row.id} selected={selected}>
                      <TD className="text-center" sticky="left" stickyOffset={0}>
                        <TableCheckbox
                          checked={selected}
                          onCheckedChange={(checked) => table.selectRow(row.id, checked)}
                        />
                      </TD>
                      <TD sticky="left" stickyOffset={TABLE_SELECTION_COLUMN_WIDTH}>{pagination.startIndex + index + 1}</TD>
                      <TD>{row.date}</TD>
                      <TD>
                        <span
                          className={cn(
                            "inline-flex h-7 items-center rounded-md px-2 text-sm font-semibold",
                            row.shift === "Ca 1"
                              ? "bg-[var(--sp-theme-soft)] text-[var(--sp-theme)]"
                              : "bg-[var(--sp-green-soft)] text-[var(--sp-green)]",
                          )}
                        >
                          {row.shift}
                        </span>
                      </TD>
                      <TD>{row.startedAt}</TD>
                      <TD>{row.endedAt}</TD>
                      <TD className="text-right">{row.checkInCount}</TD>
                      <TD className="text-right">{row.checkOutCount}</TD>
                      <TD className="text-right">{row.vehicleCount}</TD>
                      <TD className="text-right">{row.lostCardCount}</TD>
                      <TD className="text-right">{row.lostCardTotal}</TD>
                      <TD className="text-right font-semibold text-[var(--sp-strong)]">
                        {row.totalIncome}
                      </TD>
                      <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon-sm" aria-label="Xem chi tiết">
                            <Eye />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="Tải báo cáo">
                            <Download />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
                </DataTable>
              </div>
            )}
            </MainTableCard>
          </div>
        </section>
      </div>
    </div>
  );
}
