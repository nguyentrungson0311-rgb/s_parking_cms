import { Topbar } from "@/app/components/layout/Topbar";
import { useAppNavigation } from "@/app/components/layout/AppShell";
import { Badge } from "@/app/components/ui/badge";
import type { PageId } from "@/app/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  FileBarChart,
  MoreHorizontal,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Tags,
} from "lucide-react";

const settingCards: Array<{
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stats: string[];
  page?: PageId;
}> = [
  {
    id: "general",
    title: "Cài đặt chung",
    description: "Thiết lập thông tin vận hành, khu vực bãi xe và quy tắc hệ thống.",
    icon: SettingsIcon,
    stats: ["4 khu vực", "12 làn xe"],
  },
  {
    id: "reports",
    title: "Báo cáo",
    description: "Cấu hình mẫu báo cáo, lịch xuất dữ liệu và định dạng biểu mẫu.",
    icon: FileBarChart,
    stats: ["6 mẫu", "Xuất tự động"],
  },
  {
    id: "pricing",
    title: "Bảng giá",
    description: "Quản lý loại xe, giá vé lượt, vé tháng và khung thời gian áp dụng.",
    icon: Tags,
    page: "settings-pricing",
    stats: ["5 loại xe", "2 nhóm giá"],
  },
  {
    id: "parameters",
    title: "Tham số",
    description: "Điều chỉnh tham số nhận diện, thời gian miễn phí và ngưỡng cảnh báo.",
    icon: SlidersHorizontal,
    stats: ["18 tham số", "Đang áp dụng"],
  },
];

export function Settings() {
  const { navigate } = useAppNavigation();

  return (
    <div className="sp-page">
      <Topbar title="Cài đặt" />

      <div className="sp-page-scroll">
        <section className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-4 pb-4 md:grid-cols-2 xl:grid-cols-4">
          {settingCards.map((item) => {
            const Icon = item.icon;
            const hasPage = Boolean(item.page);
            const goToPage = () => {
              if (item.page) navigate(item.page);
            };

            return (
              <button
                key={item.id}
                type="button"
                disabled={!hasPage}
                onClick={hasPage ? goToPage : undefined}
                className={cn(
                  "flex min-h-[240px] w-full flex-col rounded-xl border border-border/0 bg-surface p-5 text-left shadow-sp-panel transition",
                  hasPage
                    ? "cursor-pointer hover:border hover:border-theme/40 hover:shadow-sp-soft"
                    : "cursor-default",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-theme-soft text-theme">
                    <Icon className="size-5" />
                  </span>
                  {hasPage ? (
                    <span className="grid size-8 place-items-center rounded-[8px] text-muted">
                      <ChevronRight className="size-5" />
                    </span>
                  ) : (
                    <span className="grid size-8 place-items-center rounded-[8px] text-muted">
                      <MoreHorizontal className="size-5" />
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-lg font-semibold text-strong">{item.title}</h2>
                <p className="mt-2 text-base leading-6 text-muted">{item.description}</p>

                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {item.stats.map((stat) => (
                    <Badge key={stat} variant="neutral">
                      {stat}
                    </Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
