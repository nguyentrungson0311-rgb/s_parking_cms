import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { ExternalCardTable } from "@/app/components/vehicles/ExternalCardTable";
import { FileDown, MoreVertical, Plus } from "lucide-react";

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

const externalCardDefaultFilters = {
  cardType: "all",
  vehicleType: "all",
  status: "active",
};

export function ExternalCard() {
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
            filterFields={externalCardFilterFields}
            defaultFilterValues={externalCardDefaultFilters}
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
            <ExternalCardTable />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
