import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { trafficData } from "@/app/data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AnalyticsChart() {
  return (
    <Card className="sp-card-large h-[460px] sp-card-borderless">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Thống kê thu nhập</CardTitle>
          <p className="mt-1 text-md text-[var(--sp-muted)]">Theo khung giờ trong ngày</p>
        </div>
        <div className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-extrabold text-[var(--sp-theme)]">
          LIVE
        </div>
      </CardHeader>
      <CardContent className="h-[370px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData} margin={{ left: -14, right: 10, top: 22, bottom: 10 }}>
            <defs>
              <linearGradient id="cars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="bikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#24C78E" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#24C78E" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E7EAF1" strokeDasharray="4 6" vertical={false} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#7B8494", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7B8494", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                border: "1px solid #E7EAF1",
                borderRadius: 14,
                boxShadow: "0 12px 30px rgba(18,32,51,.12)",
              }}
            />
            <Area type="monotone" dataKey="cars" name="Ô tô" stroke="var(--color-brand)" strokeWidth={3} fill="url(#cars)" />
            <Area type="monotone" dataKey="bikes" name="Xe máy" stroke="#24C78E" strokeWidth={3} fill="url(#bikes)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
