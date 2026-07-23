import { useState } from "react";
import { ComplexTableCard } from "@/app/components/common/ComplexTableCard";
import {
  ShiftHandoverTicketTable,
  ShiftSlotOverview,
} from "@/app/components/vehicles/ShiftHandoverDetailTables";
import { Button } from "@/app/components/ui/button";
import {
  shiftHandoverSections,
  shiftProfitSummaryCards,
  shiftSlotRows,
  shiftTicketSectionMap,
  type ShiftHandoverDetailSection,
  type ShiftHandoverSectionItem,
  type ShiftSlotRow,
  type ShiftSlotView,
} from "@/app/data/shifthandoverdetail";
import { ShiftAssignDetail } from "@/app/pages/ShiftAssignDetail";
import type { ShiftAssign, ShiftHandoverBatch } from "@/app/types";
import { cn } from "@/lib/utils";
import { BarChart3, FileCheck2, Grid2X2, List, MoreVertical } from "lucide-react";

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
  const ticketType = shiftTicketSectionMap[activeSection];
  const tableContent = Boolean(ticketType) || (activeSection === "slots" && slotView === "table");

  const handleApplyTotalSlots = (id: string, totalSlots: number) => {
    setSlotRows((current) =>
      current.map((row) => (row.id === id ? { ...row, totalSlots } : row)),
    );
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
          />
        }
        aside={
          <ShiftHandoverDetailAside
            activeSection={activeSection}
            onSelect={setActiveSection}
          />
        }
        tableHeader={
          ticketType
            ? {
                title: ticketType,
                searchPlaceholder: "Tìm số thẻ, mã thẻ, biển số, khách hàng...",
                actions: (
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="size-9.5"
                    aria-label="Mở thêm hành động"
                  >
                    <MoreVertical />
                  </Button>
                ),
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
  onApplyTotalSlots,
  onOpenVehicleDetail,
}: {
  activeSection: ShiftHandoverDetailSection;
  slotRows: ShiftSlotRow[];
  slotView: ShiftSlotView;
  ticketType?: ShiftAssign["ticketType"];
  shiftAssignRows: ShiftAssign[];
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
        rows={shiftAssignRows}
        ticketType={ticketType}
        onOpenDetail={onOpenVehicleDetail}
      />
    );
  }

  if (activeSection === "profit") {
    return <ShiftHandoverProfitSummary />;
  }

  return <ShiftHandoverReportBuilder />;
}

function ShiftHandoverHeaderActions({
  activeSection,
  ticketType,
  slotView,
  onSlotViewChange,
}: {
  activeSection: ShiftHandoverDetailSection;
  ticketType?: ShiftAssign["ticketType"];
  slotView: ShiftSlotView;
  onSlotViewChange: (view: ShiftSlotView) => void;
}) {
  if (activeSection === "slots") {
    return <SlotViewToggle view={slotView} onViewChange={onSlotViewChange} />;
  }

  if (ticketType) {
    return (
      <Button size="md">
        <i className="bi bi-check-square-fill text-base leading-none" aria-hidden="true" />
        Chốt phương tiện
      </Button>
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
    <div className="flex items-center rounded-md bg-surface p-1">
      <button
        type="button"
        className={cn(
          "grid size-8 place-items-center rounded-[6px] text-muted transition",
          view === "table" && "bg-theme-soft text-theme",
        )}
        title="Xem dạng bảng"
        aria-label="Xem dạng bảng"
        onClick={() => onViewChange("table")}
      >
        <List className="size-4" />
      </button>
      <button
        type="button"
        className={cn(
          "grid size-8 place-items-center rounded-[6px] text-muted transition",
          view === "grid" && "bg-theme-soft text-theme",
        )}
        title="Xem dạng thống kê"
        aria-label="Xem dạng thống kê"
        onClick={() => onViewChange("grid")}
      >
        <Grid2X2 className="size-4" />
      </button>
    </div>
  );
}

function ShiftHandoverDetailAside({
  activeSection,
  onSelect,
}: {
  activeSection: ShiftHandoverDetailSection;
  onSelect: (section: ShiftHandoverDetailSection) => void;
}) {
  const handoverItems = shiftHandoverSections.filter((item) => item.group === "handover");
  const summaryItems = shiftHandoverSections.filter((item) => item.group === "summary");

  return (
    <>
      <AsideGroup
        title="Chốt phương tiện ra / vào"
        items={handoverItems}
        activeSection={activeSection}
        onSelect={onSelect}
      />
      <div className="my-3 h-px bg-border" />
      <AsideGroup
        title="Tổng hợp"
        items={summaryItems}
        activeSection={activeSection}
        onSelect={onSelect}
      />
    </>
  );
}

function AsideGroup({
  title,
  items,
  activeSection,
  onSelect,
}: {
  title: string;
  items: ShiftHandoverSectionItem[];
  activeSection: ShiftHandoverDetailSection;
  onSelect: (section: ShiftHandoverDetailSection) => void;
}) {
  return (
    <div>
      <div className="px-2 py-1 text-xs font-bold uppercase leading-4 text-muted">
        {title}
      </div>
      <div className="mt-1 space-y-1">
        {items.map((item) => {
          const active = item.id === activeSection;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex min-h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-semibold transition",
                active
                  ? "bg-theme-soft text-theme"
                  : "text-muted hover:bg-badge-neutral-bg hover:text-strong",
              )}
              onClick={() => onSelect(item.id)}
            >
              <i className={cn("text-base leading-none", item.icon)} aria-hidden="true" />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShiftHandoverProfitSummary() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto">
      <div className="flex items-center gap-3">
        <BarChart3 className="size-5 text-theme" />
        <h3 className="text-xl font-semibold text-strong">Tổng hợp lợi nhuận</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {shiftProfitSummaryCards.map((card) => (
          <div key={card.label} className="rounded-md border border-border bg-surface p-4">
            <div className="text-sm font-semibold text-muted">{card.label}</div>
            <div className="mt-3 text-2xl font-semibold text-strong">{card.value}</div>
          </div>
        ))}
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
