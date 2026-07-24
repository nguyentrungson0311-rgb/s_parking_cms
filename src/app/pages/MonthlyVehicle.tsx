import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField, FilterPanelValues } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { MonthlyVehicleTable } from "@/app/components/vehicles/MonthlyVehicleTable";
import { vehicleMonthVehicles } from "@/app/data/vehiclemonth";
import {
  matchesTableFilterValue,
  parseTableDate,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import type { Vehicle } from "@/app/types";
import { MoreVertical, Plus } from "lucide-react";

const monthlyVehicleFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "cardType",
    label: "Loại thẻ",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "monthly", label: "Vé tháng" },
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
      { value: "active", label: "Đang hoạt động" },
      { value: "locked", label: "Tạm khóa" },
      { value: "paymentOverdue", label: "Quá hạn TT" },
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

const monthlyVehicleDefaultFilters: FilterPanelValues = {
  cardType: "all",
  vehicleType: "all",
  status: "all",
};

const monthlyVehicleSearchFields: Array<keyof Vehicle> = [
  "lotCardNumber",
  "plate",
  "owner",
  "phone",
  "vehicleName",
  "vehicleType",
];

export function MonthlyVehicle({
  title,
  onOpenDetail,
}: {
  title: string;
  onOpenDetail: (mode?: "view" | "edit") => void;
}) {
  const query = useTableQuery({
    rows: vehicleMonthVehicles,
    defaultFilters: monthlyVehicleDefaultFilters,
    searchFields: monthlyVehicleSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue("monthly", filters.cardType)) return false;
      if (!matchesTableFilterValue(row.vehicleType, filters.vehicleType)) return false;
      if (!matchesTableFilterValue(row.status, filters.status)) return false;
      if (typeof filters.cardCode === "string" && filters.cardCode.trim()) {
        if (!row.lotCardNumber.toLowerCase().includes(filters.cardCode.toLowerCase())) return false;
      }
      if (typeof filters.plate === "string" && filters.plate.trim()) {
        if (!row.plate.toLowerCase().includes(filters.plate.toLowerCase())) return false;
      }
      if (filters.enableTime) {
        const deliveredAt = parseTableDate(row.deliveredAt);
        const fromDate = parseTableDate(filters.fromDate);
        const toDate = parseTableDate(filters.toDate);
        if (fromDate && (!deliveredAt || deliveredAt < fromDate)) return false;
        if (toDate && (!deliveredAt || deliveredAt > toDate)) return false;
      }

      return true;
    },
  });

  return (
    <div className="sp-page">
      <Topbar
        title="Quản lý phương tiện"
        breadcrumbs={["Home page", "Quản lý phương tiện", title]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <MainTableCard
            title="Danh sách vé tháng"
            searchPlaceholder="Tìm số thẻ (LOT), biển số, họ tên, số điện thoại..."
            searchValue={query.search}
            onSearchChange={query.setSearch}
            filterFields={monthlyVehicleFilterFields}
            filterValues={query.filters}
            defaultFilterValues={monthlyVehicleDefaultFilters}
            onFilterApply={query.setFilters}
            onFilterReset={query.resetFilters}
            actions={({ filterButton }) => (
              <>
                {filterButton}
                <Button size="md">
                  <Plus />
                  Thêm mới
                </Button>
                <Button variant="outline" size="icon-sm" className="size-9.5">
                  <MoreVertical />
                </Button>
              </>
            )}
          >
            <MonthlyVehicleTable rows={query.filteredRows} onOpenDetail={onOpenDetail} />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
