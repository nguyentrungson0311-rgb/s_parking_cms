import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField, FilterPanelValues } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { DailyCardTable } from "@/app/components/vehicles/DailyCardTable";
import { dailyCards } from "@/app/data/dailycard";
import {
  matchesTableFilterValue,
  parseTableDate,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import type { DailyCard as DailyCardRow } from "@/app/types";
import { MoreVertical, Plus } from "lucide-react";

const dailyCardFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "cardType",
    label: "Loại thẻ",
    options: [
      { value: "all", label: "Tất cả" },
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
    type: "text",
    name: "cardCode",
    label: "Mã thẻ",
    placeholder: "Mã thẻ",
  },
  {
    type: "text",
    name: "projectCode",
    label: "Mã dự án",
    placeholder: "Mã dự án",
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
      { value: "expired", label: "Hết hiệu lực" },
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

const dailyCardDefaultFilters: FilterPanelValues = {
  cardType: "all",
  vehicleType: "all",
  status: "all",
};

const dailyCardSearchFields: Array<keyof DailyCardRow> = [
  "cardNumber",
  "projectCode",
  "vehicleType",
  "lastUsedAt",
];

export function DailyCard() {
  const query = useTableQuery({
    rows: dailyCards,
    defaultFilters: dailyCardDefaultFilters,
    searchFields: dailyCardSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue("daily", filters.cardType)) return false;
      if (!matchesTableFilterValue(row.vehicleType, filters.vehicleType)) return false;
      if (!matchesTableFilterValue(row.status, filters.status)) return false;
      if (typeof filters.cardCode === "string" && filters.cardCode.trim()) {
        if (!row.cardNumber.toLowerCase().includes(filters.cardCode.toLowerCase())) return false;
      }
      if (typeof filters.projectCode === "string" && filters.projectCode.trim()) {
        if (!row.projectCode.toLowerCase().includes(filters.projectCode.toLowerCase())) return false;
      }
      if (filters.enableTime) {
        const importedAt = parseTableDate(row.importedAt);
        const fromDate = parseTableDate(filters.fromDate);
        const toDate = parseTableDate(filters.toDate);
        if (fromDate && (!importedAt || importedAt < fromDate)) return false;
        if (toDate && (!importedAt || importedAt > toDate)) return false;
      }

      return true;
    },
  });

  return (
    <div className="sp-page">
      <Topbar
        title="Quản lý phương tiện"
        breadcrumbs={["Home page", "Quản lý phương tiện", "Quản lý vé ngày"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <MainTableCard
            title="Danh sách vé ngày"
            searchPlaceholder="Tìm số thẻ, mã dự án, loại phương tiện..."
            searchValue={query.search}
            onSearchChange={query.setSearch}
            filterFields={dailyCardFilterFields}
            filterValues={query.filters}
            defaultFilterValues={dailyCardDefaultFilters}
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
            <DailyCardTable rows={query.filteredRows} />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
