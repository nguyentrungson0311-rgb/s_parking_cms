import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { OverdueVehicleTable } from "@/app/components/vehicles/OverdueVehicleTable";
import { MoreVertical } from "lucide-react";

const overdueVehicleFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "ticketType",
    label: "Loại vé",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "monthly", label: "Vé tháng" },
      { value: "turn", label: "Vé lượt" },
      { value: "outside", label: "Vé ngoài" },
    ],
  },
  {
    type: "select",
    name: "vehicleType",
    label: "Phương tiện",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "car", label: "Ô tô" },
      { value: "motorbike", label: "Xe máy" },
      { value: "electricMotorbike", label: "Xe máy điện" },
      { value: "bike", label: "Xe đạp" },
    ],
  },
  {
    type: "text",
    name: "overdueDays",
    label: "Số ngày",
    inputType: "text",
    inputMode: "numeric",
    pattern: "[0-9]*",
    normalizeValue: (value) => value.replace(/\D/g, ""),
    leftIcon: false,
    placeholder: "Nhập số ngày",
  },
];

const overdueVehicleDefaultFilters = {
  ticketType: "all",
  vehicleType: "all",
};

export function OverdueVehicle() {
  return (
    <div className="sp-page">
      <Topbar
        title="Quản lý phương tiện"
        breadcrumbs={["Home page", "Quản lý phương tiện", "Xe để quá ngày"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <MainTableCard
            title="Danh sách xe để quá ngày"
            searchPlaceholder="Tìm số thẻ, số vé, mã thẻ, biển số, họ tên..."
            filterFields={overdueVehicleFilterFields}
            defaultFilterValues={overdueVehicleDefaultFilters}
            actions={({ filterButton }) => (
              <>
                {filterButton}
                <Button variant="outline" size="icon-sm" className="size-9.5">
                  <MoreVertical />
                </Button>
              </>
            )}
          >
            <OverdueVehicleTable />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
