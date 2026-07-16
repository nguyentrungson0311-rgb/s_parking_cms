import { Button } from "@/app/components/ui/button";
import { SearchInput } from "@/app/components/ui/input";
import { Car, Filter, RotateCcw, ScanLine } from "lucide-react";

const filters = ["Tất cả", "Đang hoạt động", "Chờ xác minh", "Quá hạn", "Tạm khóa"];

export function VehicleFilters() {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="font-sf text-xl font-semibold text-[var(--sp-strong)]">
            Danh sách phương tiện
          </h2>
          <p className="mt-2 text-base text-[var(--sp-muted)]">
            7.056 phương tiện · cập nhật theo thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <ScanLine />
            Quét biển số
          </Button>
          <Button>
            <Car />
            Thêm phương tiện
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput className="w-[420px]" placeholder="Tìm biển số, chủ xe, số điện thoại..." />
        <Button variant="outline">
          <Filter />
          Bộ lọc nâng cao
        </Button>
        <Button variant="ghost">
          <RotateCcw />
          Đặt lại
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={
              index === 0
                ? "h-8 rounded-lg border border-[var(--sp-blue)] bg-[var(--sp-blue)] px-4 text-sm font-extrabold text-white"
                : "h-8 rounded-lg border border-[var(--sp-border)] bg-white px-4 text-sm font-bold text-[#6C778A] hover:border-[var(--sp-blue)]/40"
            }
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
