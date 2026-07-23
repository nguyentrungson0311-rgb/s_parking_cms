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

type ChartTooltipPayload = {
  name?: string;
  value?: number | string;
};

function ChartTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: ChartTooltipPayload[];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[14px] border border-border bg-surface px-3 py-2 text-sm font-medium text-text shadow-soft">
      <div className="mb-1 font-semibold text-strong">{label}</div>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="whitespace-nowrap leading-5 text-text">
            {item.name} : {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsChart() {
  return (
    <Card className="sp-card-large h-[460px] sp-card-borderless">
      <CardHeader className="items-center">
        <div>
          <CardTitle>Thống kê thu nhập</CardTitle>
          <p className="mt-1 text-md text-muted">Theo khung giờ trong ngày</p>
        </div>
        <div className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-theme">
          LIVE
        </div>
      </CardHeader>
      <CardContent className="h-[370px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData} margin={{ left: -14, right: 10, top: 22, bottom: 10 }}>
            <defs>
              <linearGradient id="cars" x1="0" y1="0" x2="0" y2="1">
                <stop className="text-primary" offset="5%" stopColor="currentColor" stopOpacity={0.35} />
                <stop className="text-primary" offset="95%" stopColor="currentColor" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="bikes" x1="0" y1="0" x2="0" y2="1">
                <stop className="text-chart-secondary" offset="5%" stopColor="currentColor" stopOpacity={0.32} />
                <stop className="text-chart-secondary" offset="95%" stopColor="currentColor" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E7EAF1" strokeDasharray="4 6" vertical={false} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#7B8494", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#7B8494", fontSize: 12 }} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "var(--sp-border-strong)", strokeWidth: 1 }}
            />
            <Area className="text-primary" type="monotone" dataKey="cars" name="Ô tô" stroke="currentColor" strokeWidth={3} fill="url(#cars)" />
            <Area className="text-chart-secondary" type="monotone" dataKey="bikes" name="Xe máy" stroke="currentColor" strokeWidth={3} fill="url(#bikes)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
