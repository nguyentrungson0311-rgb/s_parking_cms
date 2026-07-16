import { MainTableCard } from "@/app/components/common/MainTableCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { DailyCardTable } from "@/app/components/vehicles/DailyCardTable";
import { FileDown, ListFilter, MoreVertical, Plus } from "lucide-react";

export function DailyCard() {
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
            <DailyCardTable />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
