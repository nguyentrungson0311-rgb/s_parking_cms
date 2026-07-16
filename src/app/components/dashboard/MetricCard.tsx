import { Card } from "@/app/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneMap = {
  blue: "bg-[var(--sp-blue-soft)] text-[var(--sp-blue)]",
  green: "bg-[#E9FFF5] text-[var(--sp-green)]",
  orange: "bg-[#FFF4D8] text-[var(--sp-orange)]",
  red: "bg-[#FDECEC] text-[#D93838]",
  purple: "bg-[#F3EFFF] text-[var(--sp-purple)]",
};

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: keyof typeof toneMap;
}) {
  return (
    <Card className="h-max p-3 sp-card-borderless">
      <div className="flex h-full items-center gap-[22px] px-4">
        <div className={cn("grid size-[62px] shrink-0 place-items-center rounded-full", toneMap[tone])}>
          <Icon className="size-[31px]" strokeWidth={2.1} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-md font-medium text-[var(--sp-muted)]">{label}</div>
          <div className="font-sf mt-1 truncate text-xl font-semibold text-[var(--sp-text)]">
            {value}
          </div>
          <div className="mt-1 text-base font-medium text-[var(--sp-green)]">{change}</div>
        </div>
      </div>
    </Card>
  );
}
