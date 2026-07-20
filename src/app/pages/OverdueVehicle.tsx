import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { OverdueVehicleTable } from "@/app/components/vehicles/OverdueVehicleTable";
import { FileDown, MoreVertical } from "lucide-react";

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
    label: "Loại phương tiện",
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
    type: "text",
    name: "apartment",
    label: "Căn hộ",
    placeholder: "Căn hộ",
  },
  {
    type: "date-range",
    name: "enableTime",
    label: "Ngày vào",
    fromName: "fromDate",
    toName: "toDate",
    fromLabel: "Từ ngày",
    toLabel: "Đến ngày",
    fromPlaceholder: "Tất cả",
    toPlaceholder: "Tất cả",
    colSpan: 3,
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
                <Button variant="outline" size="md">
                  <FileDown />
                  Xuất file
                </Button>
                {filterButton}
                <Button variant="outline" size="icon-sm" className="size-10">
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
