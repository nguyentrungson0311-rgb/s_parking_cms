import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { occupancy } from "@/app/data";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const htmlPalette = ["#7B66F6", "#f57672", "#3BC0D5", "#D9D9DC"];

export function OccupancyDonut() {
  return (
    <Card className="sp-card-large h-[460px] sp-card-borderless">
      <CardHeader>
        <div>
          <CardTitle>Sử dụng chỗ đỗ</CardTitle>
          <p className="mt-1 text-md text-[var(--sp-muted)]"> Theo loại phương tiện </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative mx-auto h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={occupancy}
                dataKey="value"
                innerRadius={44}
                outerRadius={94}
                paddingAngle={1}
                cornerRadius={8}
                stroke="#FFFFFF"
                strokeWidth={7}
                startAngle={105}
                endAngle={-255}
              >
                {occupancy.map((item, index) => (
                  <Cell key={item.name} fill={htmlPalette[index] ?? item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="font-sf text-xl font-semibold text-[var(--sp-strong)]">76%</div>
              <div className="text-md font-medium text-[var(--sp-muted)]"> Sử dụng </div>
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-3">
          {occupancy.map((item, index) => (
            <div key={item.name} className="flex h-7 items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="size-4 shrink-0 rounded-full"
                  style={{ backgroundColor: htmlPalette[index] ?? item.color }}
                />
                <span className="truncate text-base font-regular leading-none text-[var(--sp-text)]">
                  {item.name} ({item.value}%)
                </span>
              </div>
              <div className="text-base font-semibold leading-none text-[var(--sp-text)]">{item.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
