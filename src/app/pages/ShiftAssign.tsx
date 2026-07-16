import { MainTableCard } from "@/app/components/common/MainTableCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { ShiftAssignTable } from "@/app/components/vehicles/ShiftAssignTable";
import { ShiftAssignDetail } from "@/app/pages/ShiftAssignDetail";
import type { ShiftAssign as ShiftAssignRecord } from "@/app/types";
import { FileDown, ListFilter, MoreVertical, Plus } from "lucide-react";
import { useState } from "react";

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
            actions={
              <>
                <Button variant="outline" size="md">
                  <FileDown />
                  Xuất file
                </Button>
                <Button variant="outline" size="md">
                  <ListFilter />
                  Lọc
                </Button>
                <Button size="md">
                  <Plus />
                  Thêm mới
                </Button>
                <Button variant="outline" size="icon-sm" className="size-10">
                  <MoreVertical />
                </Button>
              </>
            }
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
