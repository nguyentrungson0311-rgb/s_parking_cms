import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField, FilterPanelValues } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { ExternalCardTable } from "@/app/components/vehicles/ExternalCardTable";
import { externalCards } from "@/app/data/externalcard";
import {
  matchesTableFilterValue,
  parseTableDate,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import type { ExternalCard as ExternalCardRow } from "@/app/types";
import { MoreVertical, Plus } from "lucide-react";

const externalCardFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "cardType",
    label: "Loại thẻ",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "external", label: "Vé ngoài" },
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

const externalCardDefaultFilters: FilterPanelValues = {
  cardType: "all",
  vehicleType: "all",
  status: "all",
};

const externalCardSearchFields: Array<keyof ExternalCardRow> = [
  "lotCardNumber",
  "cardNumber",
  "owner",
  "phone",
  "plate",
  "vehicleName",
  "vehicleType",
];

export function ExternalCard() {
  const query = useTableQuery({
    rows: externalCards,
    defaultFilters: externalCardDefaultFilters,
    searchFields: externalCardSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue("external", filters.cardType)) return false;
      if (!matchesTableFilterValue(row.vehicleType, filters.vehicleType)) return false;
      if (!matchesTableFilterValue(row.status, filters.status)) return false;
      if (typeof filters.cardCode === "string" && filters.cardCode.trim()) {
        const keyword = filters.cardCode.toLowerCase();
        if (
          !row.cardNumber.toLowerCase().includes(keyword) &&
          !row.lotCardNumber.toLowerCase().includes(keyword)
        ) {
          return false;
        }
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
        breadcrumbs={["Home page", "Quản lý phương tiện", "Quản lý vé ngoài"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          <MainTableCard
            title="Danh sách vé ngoài"
            searchPlaceholder="Tìm số thẻ, họ tên, số điện thoại, biển số..."
            searchValue={query.search}
            onSearchChange={query.setSearch}
            filterFields={externalCardFilterFields}
            filterValues={query.filters}
            defaultFilterValues={externalCardDefaultFilters}
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
            <ExternalCardTable rows={query.filteredRows} />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
