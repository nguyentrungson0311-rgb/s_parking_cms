import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { CarFront, CircleParking, CreditCard } from "lucide-react";

export function VehicleSidePanel() {
  return (
    <aside className="space-y-[22px]">
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan bãi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            ["Tòa S1", 82, "1.092 / 1.330"],
            ["Tòa S2", 64, "830 / 1.296"],
            ["Tòa S3", 91, "1.180 / 1.296"],
          ].map(([label, value, meta]) => (
            <div key={label as string}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-bold text-[var(--sp-strong)]">{label}</span>
                <span className="mono font-bold text-[var(--sp-muted)]">{meta}</span>
              </div>
              <Progress value={value as number} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="data-grid p-[22px]">
          <div className="grid size-14 place-items-center rounded-[18px] bg-[var(--sp-blue)] text-white">
            <CreditCard className="size-7" />
          </div>
          <div className="font-sf mt-6 text-2xl font-bold text-[var(--sp-strong)]">986</div>
          <div className="mt-1 text-base text-[var(--sp-muted)]">Thẻ tháng đang hiệu lực</div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <CircleParking className="size-6 text-[var(--sp-blue)]" />
          <div className="font-sf mt-4 text-xl font-bold">328</div>
          <div className="text-xs text-[var(--sp-muted)]">Chỗ trống</div>
        </Card>
        <Card className="p-4">
          <CarFront className="size-6 text-[var(--sp-orange)]" />
          <div className="font-sf mt-4 text-xl font-bold">47</div>
          <div className="text-xs text-[var(--sp-muted)]">Xe vãng lai</div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-[var(--sp-strong)]">Đồng bộ camera</div>
          <StatusBadge tone="green">Ổn định</StatusBadge>
        </div>
        <div className="mt-3 text-sm leading-6 text-[var(--sp-muted)]">
          24/24 camera hoạt động. Dữ liệu biển số đã đồng bộ lúc 09:45.
        </div>
      </Card>
    </aside>
  );
}
