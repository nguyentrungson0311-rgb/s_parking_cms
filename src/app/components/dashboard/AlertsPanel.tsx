import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const cardStats = [
  { title: "Thẻ nội bộ", count: "300", value: 300, percent: "98%", color: "#844ee9" },
  { title: "Thẻ cư dân", count: "986", value: 986, percent: "92%", color: "#01b862" },
  { title: "Vé lượt", count: "5.822", value: 1900, percent: "76%", color: "#f885bb" },
];

const totalCards = cardStats.reduce((sum, item) => sum + item.value, 0);

export function AlertsPanel() {
  return (
    <Card className="sp-card-large h-[460px] sp-card-borderless">
      <CardHeader>
        <div>
          <CardTitle>Thống kê thẻ xe</CardTitle>
          <p className="mt-1 text-md text-[var(--sp-muted)]">13/07/2026</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative mx-auto h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={cardStats}
                dataKey="value"
                innerRadius={44}
                outerRadius={94}
                paddingAngle={2}
                cornerRadius={8}
                stroke="var(--sp-surface)"
                strokeWidth={7}
                startAngle={105}
                endAngle={-255}
              >
                {cardStats.map((item) => (
                  <Cell key={item.title} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-xl font-semibold text-[var(--sp-strong)]">
                {totalCards.toLocaleString("vi-VN")}
              </div>
              <div className="text-md font-medium text-[var(--sp-muted)]">thẻ</div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {cardStats.map((item) => (
            <div
              key={item.title}
              className="grid min-h-8 grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="size-4 shrink-0 rounded-md" style={{ backgroundColor: item.color }} />
                <span className="min-w-0 truncate text-base font-regular leading-6 text-[var(--sp-text)]">
                  {item.title}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="rounded-full bg-[var(--badge-neutral-bg)] px-2 py-1 text-xs font-bold leading-4 text-[var(--sp-muted)]">
                  {item.percent}
                </span>
                <span className="min-w-[56px] text-right text-base font-semibold leading-6 text-[var(--sp-text)]">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
