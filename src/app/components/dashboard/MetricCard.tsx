import { Card } from "@/app/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const toneMap = {
  blue: "bg-theme-soft text-theme",
  green: "bg-green-soft text-green",
  orange: "bg-orange-soft text-orange",
  red: "bg-red-soft text-destructive",
  purple: "bg-purple-soft text-purple",
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
          <div className="truncate text-md font-medium text-muted">{label}</div>
          <div className="font-sf mt-1 truncate text-xl font-semibold text-text">
            {value}
          </div>
          <div className="mt-1 text-base font-medium text-green">{change}</div>
        </div>
      </div>
    </Card>
  );
}
