import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const shiftTraffic = [
  { name: "Xe máy", in: 420, out: 320 },
  { name: "Ô tô", in: 400, out: 520 },
];

export function ShiftTrafficCard() {
  return (
    <Card className="sp-card-large h-[448px]  sp-card-borderless">
      <CardHeader className="items-start">
        <div>
          <CardTitle>Lưu lượng xe Ca -1</CardTitle>
          <p className="mt-1 text-md text-muted">13/07/2026</p>
        </div>
        <Button variant="outline" size="md" className="shrink-0 font-medium text-muted">
          Hôm nay
          <ChevronDown />
        </Button>
      </CardHeader>

      <div className="mt-7 flex items-center justify-center gap-10">
        <div className="flex items-center gap-3">
          <span className="size-4 rounded-sm bg-cyan" />
          <span className="text-base font-medium text-text">Lượt vào</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-4 rounded-sm bg-[#F05252]" />
          <span className="text-base font-medium text-text">Lượt ra</span>
        </div>
      </div>

      <div className="mt-3 h-[300px] px-5 pb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={shiftTraffic} margin={{ top: 8, right: 4, left: -18, bottom: 8 }} barGap={7} barCategoryGap="38%">
            <defs>
              <linearGradient id="trafficIn" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3BC0D5" />
                <stop offset="100%" stopColor="#BEEFE9" />
              </linearGradient>
              <linearGradient id="trafficOut" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#F05252" />
                <stop offset="100%" stopColor="#FF8782" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#EEF1F5" />
            <YAxis
              width={50}
              domain={[0, 800]}
              ticks={[0, 200, 400, 600, 800]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0A7B2", fontSize: 12, fontFamily: "Geist Mono, SF Mono, JetBrains Mono, ui-monospace, monospace" }}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#A0A7B2", fontSize: 16, fontFamily: "Inter, SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif" }}
              dy={12}
            />
            <Bar dataKey="in" fill="url(#trafficIn)" radius={[8, 8, 0, 0]} barSize={28} />
            <Bar dataKey="out" fill="url(#trafficOut)" radius={[8, 8, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
