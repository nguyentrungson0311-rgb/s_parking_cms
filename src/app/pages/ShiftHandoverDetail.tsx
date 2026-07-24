import { useState } from "react";
import type {
  FilterPanelField,
  FilterPanelValues,
} from "@/app/components/common/FilterPanel";
import { ComplexTableCard } from "@/app/components/common/ComplexTableCard";
import {
  ShiftHandoverProfitSummary,
  ShiftHandoverTicketTable,
  ShiftSlotOverview,
} from "@/app/components/vehicles/ShiftHandoverDetailTables";
import { Button } from "@/app/components/ui/button";
import {
  shiftHandoverSections,
  shiftSlotRows,
  shiftTicketSectionMap,
  type ShiftHandoverDetailSection,
  type ShiftHandoverSectionItem,
  type ShiftSlotRow,
  type ShiftSlotView,
} from "@/app/data/shifthandoverdetail";
import {
  matchesTableFilterValue,
  parseTableDate,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import { toastMessage } from "@/app/components/ui/toast";
import { ShiftAssignDetail } from "@/app/pages/ShiftAssignDetail";
import type { ShiftAssign, ShiftHandoverBatch } from "@/app/types";
import { cn } from "@/lib/utils";
import { FileCheck2, Grid2X2, List, MoreVertical } from "lucide-react";

const shiftTicketFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "vehicleType",
    label: "Loại xe",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "Ô tô", label: "Ô tô" },
      { value: "Xe máy", label: "Xe máy" },
      { value: "Xe máy điện", label: "Xe máy điện" },
      { value: "Xe đạp", label: "Xe đạp" },
    ],
  },
  {
    type: "select",
    name: "status",
    label: "Trạng thái",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "inYard", label: "Đang trong bãi" },
      { value: "exited", label: "Đã ra" },
    ],
  },
  {
    type: "date-range",
    name: "checkedInRange",
    label: "Ngày vào",
    fromName: "checkedInFrom",
    toName: "checkedInTo",
    fromLabel: "Từ ngày",
    toLabel: "Đến ngày",
    fromPlaceholder: "Tất cả",
    toPlaceholder: "Tất cả",
    colSpan: 3,
  },
];

const shiftTicketDefaultFilters: FilterPanelValues = {
  vehicleType: "all",
  status: "all",
};

const shiftTicketSearchFields: Array<keyof ShiftAssign> = [
  "lotCardNumber",
  "ticketNumber",
  "cardCode",
  "plate",
  "customer",
  "vehicleType",
  "ticketType",
];

export function ShiftHandoverDetail({
  batch,
  shiftAssignRows,
  onBack,
}: {
  batch: ShiftHandoverBatch;
  shiftAssignRows: ShiftAssign[];
  onBack: () => void;
}) {
  const [activeSection, setActiveSection] = useState<ShiftHandoverDetailSection>("slots");
  const [slotView, setSlotView] = useState<ShiftSlotView>("table");
  const [slotRows, setSlotRows] = useState(shiftSlotRows);
  const [selectedVehicle, setSelectedVehicle] = useState<ShiftAssign | null>(null);
  const [finalizedTicketTypes, setFinalizedTicketTypes] = useState<ShiftAssign["ticketType"][]>([]);
  const ticketType = shiftTicketSectionMap[activeSection];
  const tableContent = Boolean(ticketType) || (activeSection === "slots" && slotView === "table");
  const ticketQuery = useTableQuery({
    rows: shiftAssignRows,
    defaultFilters: shiftTicketDefaultFilters,
    searchFields: shiftTicketSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue(row.vehicleType, filters.vehicleType)) return false;
      if (!matchesTableFilterValue(row.status, filters.status)) return false;
      if (filters.checkedInRange) {
        const checkedInDate = parseTableDate(row.checkedInAt);
        const checkedInFrom = parseTableDate(filters.checkedInFrom);
        const checkedInTo = parseTableDate(filters.checkedInTo);
        if (checkedInFrom && (!checkedInDate || checkedInDate < checkedInFrom)) return false;
        if (checkedInTo && (!checkedInDate || checkedInDate > checkedInTo)) return false;
      }

      return true;
    },
  });

  const handleApplyTotalSlots = (id: string, totalSlots: number) => {
    setSlotRows((current) =>
      current.map((row) => (row.id === id ? { ...row, totalSlots } : row)),
    );
  };

  const handleFinalizeTicketType = (nextTicketType: ShiftAssign["ticketType"]) => {
    setFinalizedTicketTypes((current) => {
      if (current.includes(nextTicketType)) {
        toastMessage.info("Nhóm vé đã được chốt", nextTicketType);
        return current;
      }

      toastMessage.success("Đã chốt phương tiện", nextTicketType);
      return [...current, nextTicketType];
    });
  };

  return (
    <>
      <ComplexTableCard
        title="Chi tiết giao ca"
        description={`${batch.code} · ${batch.name} · ${batch.shift} · ${batch.date}`}
        onBack={onBack}
        actions={
          <ShiftHandoverHeaderActions
            activeSection={activeSection}
            ticketType={ticketType}
            slotView={slotView}
            onSlotViewChange={setSlotView}
            onFinalizeTicketType={handleFinalizeTicketType}
          />
        }
        aside={
          <ShiftHandoverDetailAside
            activeSection={activeSection}
            finalizedTicketTypes={finalizedTicketTypes}
            onSelect={setActiveSection}
          />
        }
        tableHeader={
          ticketType
            ? {
                title: ticketType,
                searchValue: ticketQuery.search,
                onSearchChange: ticketQuery.setSearch,
                filterFields: shiftTicketFilterFields,
                filterValues: ticketQuery.filters,
                defaultFilterValues: shiftTicketDefaultFilters,
                onFilterApply: ticketQuery.setFilters,
                onFilterReset: ticketQuery.resetFilters,
                searchPlaceholder: "Tìm số thẻ, mã thẻ, biển số, khách hàng...",
              }
            : undefined
        }
        contentClassName={tableContent ? "p-0" : "p-4"}
      >
        <ShiftHandoverDetailContent
          activeSection={activeSection}
          slotRows={slotRows}
          slotView={slotView}
          ticketType={ticketType}
          shiftAssignRows={shiftAssignRows}
          ticketRows={ticketQuery.filteredRows}
          finalizedTicketTypes={finalizedTicketTypes}
          onApplyTotalSlots={handleApplyTotalSlots}
          onOpenVehicleDetail={setSelectedVehicle}
        />
      </ComplexTableCard>

      <ShiftAssignDetail
        open={Boolean(selectedVehicle)}
        item={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </>
  );
}

function ShiftHandoverDetailContent({
  activeSection,
  slotRows,
  slotView,
  ticketType,
  shiftAssignRows,
  ticketRows,
  finalizedTicketTypes,
  onApplyTotalSlots,
  onOpenVehicleDetail,
}: {
  activeSection: ShiftHandoverDetailSection;
  slotRows: ShiftSlotRow[];
  slotView: ShiftSlotView;
  ticketType?: ShiftAssign["ticketType"];
  shiftAssignRows: ShiftAssign[];
  ticketRows: ShiftAssign[];
  finalizedTicketTypes: ShiftAssign["ticketType"][];
  onApplyTotalSlots: (id: string, totalSlots: number) => void;
  onOpenVehicleDetail: (item: ShiftAssign) => void;
}) {
  if (activeSection === "slots") {
    return (
      <ShiftSlotOverview
        rows={slotRows}
        view={slotView}
        onApplyTotalSlots={onApplyTotalSlots}
      />
    );
  }

  if (ticketType) {
    return (
      <ShiftHandoverTicketTable
        rows={ticketRows}
        ticketType={ticketType}
        onOpenDetail={onOpenVehicleDetail}
      />
    );
  }

  if (activeSection === "profit") {
    return (
      <ShiftHandoverProfitSummary
        rows={shiftAssignRows}
        finalizedTicketTypes={finalizedTicketTypes}
      />
    );
  }

  return <ShiftHandoverReportBuilder />;
}

function ShiftHandoverHeaderActions({
  activeSection,
  ticketType,
  slotView,
  onSlotViewChange,
  onFinalizeTicketType,
}: {
  activeSection: ShiftHandoverDetailSection;
  ticketType?: ShiftAssign["ticketType"];
  slotView: ShiftSlotView;
  onSlotViewChange: (view: ShiftSlotView) => void;
  onFinalizeTicketType: (ticketType: ShiftAssign["ticketType"]) => void;
}) {
  if (activeSection === "slots") {
    return <SlotViewToggle view={slotView} onViewChange={onSlotViewChange} />;
  }

  if (ticketType) {
    return (
      <>
        <Button size="md" onClick={() => onFinalizeTicketType(ticketType)}>
          <i className="bi bi-check-square-fill text-base leading-none" aria-hidden="true" />
          Chốt phương tiện
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="size-9.5"
          aria-label="Mở thêm hành động"
          title="Mở thêm hành động"
        >
          <MoreVertical />
        </Button>
      </>
    );
  }

  if (activeSection === "profit") {
    return (
      <Button size="md">
        <i className="bi bi-calculator-fill text-base leading-none" aria-hidden="true" />
        Tính lợi nhuận
      </Button>
    );
  }

  return (
    <Button size="md">
      <i className="bi bi-file-earmark-check-fill text-base leading-none" aria-hidden="true" />
      Tạo báo cáo
    </Button>
  );
}

function SlotViewToggle({
  view,
  onViewChange,
}: {
  view: ShiftSlotView;
  onViewChange: (view: ShiftSlotView) => void;
}) {
  return (
    <div className="flex items-center rounded-md bg-surface">
            <Button
        type="button"
        variant={view === "grid" ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "rounded-[8px] size-9",
          view === "grid" ? "text-theme" : "text-muted",
        )}
        title="Xem dạng thống kê"
        aria-label="Xem dạng thống kê"
        onClick={() => onViewChange("grid")}
      >
        <Grid2X2 className="size-4" />
      </Button>
      <Button
        type="button"
        variant={view === "table" ? "secondary" : "ghost"}
        size="icon-sm"
        className={cn(
          "rounded-[8px] size-9",
          view === "table" ? "text-theme" : "text-muted",
        )}
        title="Xem dạng bảng"
        aria-label="Xem dạng bảng"
        onClick={() => onViewChange("table")}
      >
        <List className="size-4" />
      </Button>
    </div>
  );
}

function ShiftHandoverDetailAside({
  activeSection,
  finalizedTicketTypes,
  onSelect,
}: {
  activeSection: ShiftHandoverDetailSection;
  finalizedTicketTypes: ShiftAssign["ticketType"][];
  onSelect: (section: ShiftHandoverDetailSection) => void;
}) {
  const handoverItems = shiftHandoverSections.filter((item) => item.group === "handover");
  const summaryItems = shiftHandoverSections.filter((item) => item.group === "summary");

  return (
    <nav className="flex flex-col gap-3 max-lg:flex-row max-lg:items-center max-lg:gap-2">
      <AsideGroup
        title="Chốt phương tiện ra / vào"
        items={handoverItems}
        activeSection={activeSection}
        finalizedTicketTypes={finalizedTicketTypes}
        onSelect={onSelect}
      />
      <div className="h-px bg-border max-lg:h-7 max-lg:w-px max-lg:shrink-0" />
      <AsideGroup
        title="Tổng hợp"
        items={summaryItems}
        activeSection={activeSection}
        finalizedTicketTypes={finalizedTicketTypes}
        onSelect={onSelect}
      />
    </nav>
  );
}

function AsideGroup({
  title,
  items,
  activeSection,
  finalizedTicketTypes,
  onSelect,
}: {
  title: string;
  items: ShiftHandoverSectionItem[];
  activeSection: ShiftHandoverDetailSection;
  finalizedTicketTypes: ShiftAssign["ticketType"][];
  onSelect: (section: ShiftHandoverDetailSection) => void;
}) {
  return (
    <div className="max-lg:flex max-lg:shrink-0 max-lg:items-center max-lg:gap-2">
      <div className="px-2 py-1 text-xs font-bold uppercase leading-4 text-muted max-lg:hidden">
        {title}
      </div>
      <div className="mt-1 space-y-1 max-lg:mt-0 max-lg:flex max-lg:items-center max-lg:gap-2 max-lg:space-y-0">
        {items.map((item) => {
          const active = item.id === activeSection;
          const ticketType = shiftTicketSectionMap[item.id];
          const finalized = ticketType ? finalizedTicketTypes.includes(ticketType) : false;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex min-h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-semibold transition max-lg:min-h-9 max-lg:w-auto max-lg:shrink-0 max-lg:whitespace-nowrap",
                active
                  ? "bg-theme-soft text-theme"
                  : "text-muted hover:bg-badge-neutral-bg hover:text-strong",
              )}
              onClick={() => onSelect(item.id)}
            >
              <i className={cn("text-base leading-none", item.icon)} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {finalized ? (
                <i
                  className="bi bi-check-circle-fill ml-auto shrink-0 text-sm leading-none text-green"
                  aria-label="Đã chốt"
                  title="Đã chốt"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShiftHandoverReportBuilder() {
  return (
    <div className="grid h-full min-h-[360px] place-items-center p-6 text-center">
      <div className="max-w-[360px]">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-theme-soft text-theme">
          <FileCheck2 className="size-7" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-strong">Tạo báo cáo giao ca</h3>
        <p className="mt-2 text-sm leading-5 text-muted">
          Tổng hợp dữ liệu chốt phương tiện, lợi nhuận và trạng thái giao ca để phát hành báo cáo.
        </p>
        <Button className="mt-5" size="md">
          <FileCheck2 />
          Tạo báo cáo
        </Button>
      </div>
    </div>
  );
}
