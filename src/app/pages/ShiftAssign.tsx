import { useState } from "react";
import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { ShiftAssignTable } from "@/app/components/vehicles/ShiftAssignTable";
import { ShiftAssignDetail } from "@/app/pages/ShiftAssignDetail";
import type { ShiftAssign as ShiftAssignRecord } from "@/app/types";
import { FileDown, MoreVertical, Plus } from "lucide-react";

const shiftAssignFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "ticketType",
    label: "Loại vé",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "monthly", label: "Vé tháng" },
      { value: "external", label: "Vé ngoài" },
      { value: "daily", label: "Vé ngày" },
    ],
  },
  {
    type: "select",
    name: "vehicleType",
    label: "Loại xe",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "car", label: "Ô tô" },
      { value: "motorbike", label: "Xe máy" },
      { value: "bike", label: "Xe đạp" },
    ],
  },
  {
    type: "select",
    name: "direction",
    label: "Vào/Ra",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "in", label: "Vào" },
      { value: "out", label: "Ra" },
    ],
  },
  {
    type: "select",
    name: "shift",
    label: "Theo ca",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "shift1", label: "Ca 1" },
      { value: "shift2", label: "Ca 2" },
    ],
  },
  {
    type: "text",
    name: "cardCode",
    label: "Mã thẻ",
    placeholder: "Mã thẻ",
  },
  {
    type: "text",
    name: "plate",
    label: "Biển số",
    placeholder: "Biển số",
  },
  {
    type: "select",
    name: "status",
    label: "Trạng thái",
    colSpan: 2,
    options: [
      { value: "all", label: "Tất cả" },
      { value: "inYard", label: "Đang trong bãi" },
      { value: "exited", label: "Đã ra" },
    ],
  },
  {
    type: "date-range",
    name: "enableTime",
    label: "Thời gian",
    fromName: "fromDate",
    toName: "toDate",
    fromLabel: "Từ ngày",
    toLabel: "Đến ngày",
    fromPlaceholder: "Tất cả",
    toPlaceholder: "Tất cả",
    colSpan: 3,
  },
];

const shiftAssignDefaultFilters = {
  ticketType: "all",
  vehicleType: "all",
  direction: "all",
  shift: "all",
  status: "inYard",
};

export function ShiftAssign() {
  const [selectedDetail, setSelectedDetail] = useState<ShiftAssignRecord | null>(null);

  return (
    <div className="sp-page">
      <Topbar
        title="Quản lý phương tiện"
        breadcrumbs={["Home page", "Quản lý phương tiện", "Giao ca"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <MainTableCard
            title="Danh sách giao ca"
            searchPlaceholder="Tìm số thẻ, vé số, mã thẻ, biển số, khách hàng..."
            filterFields={shiftAssignFilterFields}
            defaultFilterValues={shiftAssignDefaultFilters}
            actions={({ filterButton }) => (
              <>
                <Button variant="outline" size="md">
                  <FileDown />
                  Xuất file
                </Button>
                {filterButton}
                <Button size="md">
                  <Plus />
                  Thêm mới
                </Button>
                <Button variant="outline" size="icon-sm" className="size-10">
                  <MoreVertical />
                </Button>
              </>
            )}
          >
            <ShiftAssignTable onOpenDetail={setSelectedDetail} />
          </MainTableCard>
        </section>
      </div>
      <ShiftAssignDetail
        open={Boolean(selectedDetail)}
        item={selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />
    </div>
  );
}
