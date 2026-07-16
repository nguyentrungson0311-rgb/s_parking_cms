import { MainTableCard } from "@/app/components/common/MainTableCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { ExternalCardTable } from "@/app/components/vehicles/ExternalCardTable";
import { FileDown, ListFilter, MoreVertical, Plus } from "lucide-react";

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
            <ExternalCardTable />
          </MainTableCard>
        </section>
      </div>
    </div>
  );
}
