import { AlertsPanel } from "@/app/components/dashboard/AlertsPanel";
import { AnalyticsChart } from "@/app/components/dashboard/AnalyticsChart";
import { MetricCard } from "@/app/components/dashboard/MetricCard";
import { OccupancyDonut } from "@/app/components/dashboard/OccupancyDonut";
import { ShiftTrafficCard } from "@/app/components/dashboard/ShiftTrafficCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { StatusBadge } from "@/app/components/ui/status-badge";
import { DataTable, TablePagination, TBody, TD, TH, THead, TR } from "@/app/components/ui/table";
import { MONTHLY_VEHICLE_STATUS } from "@/app/components/vehicles/MonthlyVehicleTable";
import { metrics } from "@/app/data";
import { vehicleMonthVehicles as vehicles } from "@/app/data/vehiclemonth";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

export function Dashboard() {
  return (
    <div className="sp-page sp-page-dashboard">
      <Topbar title="Tổng quan" />

      <div className="sp-page-scroll">
        <section className="sp-kpi-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section
          className="sp-layout"
          style={{
            "--sp-layout-template": "minmax(520px, 1.48fr) minmax(320px, 0.78fr) minmax(320px, 0.82fr)",
            "--sp-layout-gap": "16px",
          } as CSSProperties}
        >
          <AnalyticsChart />
          <OccupancyDonut />
          <AlertsPanel />
        </section>

        <section
          className="sp-layout"
          style={{
            "--sp-layout-template": "minmax(360px, 0.68fr) minmax(680px, 1.45fr)",
            "--sp-layout-gap": "22px",
          } as CSSProperties}
        >
          <ShiftTrafficCard />
          <Card className="sp-card-large min-h-[448px] sp-card-borderless">
            <CardHeader className="items-center">
              <div>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <p className="mt-1 text-md text-[var(--sp-muted)]">Vé mất và lượt vào thẳng</p>
              </div>
              <Button variant="ghost" size="sm">
                Xem thêm
                <ArrowRight />
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable footer={<TablePagination summary="1-10 of 7,056 results" />}>
                <THead>
                  <TR>
                    <TH className="w-8">
                      <span className="block size-[14px] rounded-[3px] border border-[var(--sp-muted)]" />
                    </TH>
                    <TH className="w-[140px]">Số thẻ (LOT)</TH>
                    <TH>Họ tên</TH>
                    <TH>Biển số</TH>
                    <TH>Phương tiện</TH>
                    <TH>Số điện thoại</TH>
                    <TH>Ngày giao</TH>
                    <TH className="text-center">Trạng thái</TH>
                  </TR>
                </THead>
                <TBody>
                  {vehicles.slice(0, 4).map((vehicle) => {
                    const status = MONTHLY_VEHICLE_STATUS[vehicle.status];
                    return (
                      <TR key={vehicle.id}>
                        <TD>
                          <span className="mx-auto block size-[14px] rounded-[3px] border border-[var(--sp-border)]" />
                        </TD>
                        <TD>{vehicle.lotCardNumber}</TD>
                        <TD>{vehicle.owner}</TD>
                        <TD>{vehicle.plate}</TD>
                        <TD>{vehicle.vehicleName}</TD>
                        <TD>{vehicle.phone}</TD>
                        <TD>{vehicle.deliveredAt}</TD>
                        <TD className="text-center">
                          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </DataTable>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
