import { MainTableCard } from "@/app/components/common/MainTableCard";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { MonthlyVehicleTable } from "@/app/components/vehicles/MonthlyVehicleTable";
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

const monthlyVehicleDefaultFilters = {
  cardType: "all",
  vehicleType: "all",
  status: "active",
};

export function MonthlyVehicle({
  title,
  onOpenDetail,
}: {
  title: string;
  onOpenDetail: (mode?: "view" | "edit") => void;
}) {
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
            filterFields={monthlyVehicleFilterFields}
            defaultFilterValues={monthlyVehicleDefaultFilters}
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
            <MonthlyVehicleTable onOpenDetail={onOpenDetail} />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
