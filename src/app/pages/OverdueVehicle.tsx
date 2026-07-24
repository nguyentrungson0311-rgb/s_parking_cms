import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField, FilterPanelValues } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { OverdueVehicleTable } from "@/app/components/vehicles/OverdueVehicleTable";
import { overdueVehicles } from "@/app/data/overduevehicle";
import {
  matchesTableFilterValue,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import type { OverdueVehicle as OverdueVehicleRow } from "@/app/types";
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

const overdueVehicleDefaultFilters: FilterPanelValues = {
  ticketType: "all",
  vehicleType: "all",
};

const overdueVehicleSearchFields: Array<keyof OverdueVehicleRow> = [
  "lotCardNumber",
  "ticketNumber",
  "cardCode",
  "plate",
  "customerName",
  "vehicleName",
  "vehicleType",
  "ticketType",
];

export function OverdueVehicle() {
  const query = useTableQuery({
    rows: overdueVehicles,
    defaultFilters: overdueVehicleDefaultFilters,
    searchFields: overdueVehicleSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue(row.ticketType, filters.ticketType)) return false;
      if (!matchesTableFilterValue(row.vehicleType, filters.vehicleType)) return false;
      if (typeof filters.overdueDays === "string" && filters.overdueDays.trim()) {
        if (row.overdueDays !== Number(filters.overdueDays)) return false;
      }

      return true;
    },
  });

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
            searchValue={query.search}
            onSearchChange={query.setSearch}
            filterFields={overdueVehicleFilterFields}
            filterValues={query.filters}
            defaultFilterValues={overdueVehicleDefaultFilters}
            onFilterApply={query.setFilters}
            onFilterReset={query.resetFilters}
            actions={({ filterButton }) => (
              <>
                {filterButton}
                <Button variant="outline" size="icon-sm" className="size-9.5">
                  <MoreVertical />
                </Button>
              </>
            )}
          >
            <OverdueVehicleTable rows={query.filteredRows} />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
