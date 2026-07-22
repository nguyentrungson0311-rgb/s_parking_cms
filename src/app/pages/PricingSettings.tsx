import { useState } from "react";
import { Topbar } from "@/app/components/layout/Topbar";
import { useAppNavigation } from "@/app/components/layout/AppShell";
import {
  MonthlyServicePricingTable,
  ServicePricingTable,
  VehicleTypeTable,
} from "@/app/components/setting/PricingSettingsTables";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import type { DynamicFormMode } from "@/app/components/ui/dynamic-form";
import { Tabs, type TabItem } from "@/app/components/ui/tabs";
import { toastMessage } from "@/app/components/ui/toast";
import { MonthlyPricingDrawer } from "@/app/pages/MonthlyPricingDrawer";
import { VehicleGroupDrawer } from "@/app/pages/VehicleGroupDrawer";
import {
  monthlyServiceRows,
  turnServiceRows,
  type MonthlyPricingRow,
} from "@/app/data/setting";
import { ArrowLeft, Plus, Settings2 } from "lucide-react";

type PricingTab = "vehicles" | "turn" | "monthly";

export function PricingSettings() {
  const { navigate } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<PricingTab>("vehicles");
  const [vehicleGroupOpen, setVehicleGroupOpen] = useState(false);
  const [monthlyRows, setMonthlyRows] =
    useState<MonthlyPricingRow[]>(monthlyServiceRows);
  const [monthlyDrawerState, setMonthlyDrawerState] = useState<{
    open: boolean;
    mode: DynamicFormMode;
    row?: MonthlyPricingRow;
  }>({ open: false, mode: "create" });
  const serviceRows = activeTab === "turn" ? turnServiceRows : monthlyRows;
  const serviceTitle =
    activeTab === "turn" ? "Dịch vụ gửi xe lượt" : "Dịch vụ gửi xe tháng";
  const tabs: Array<TabItem<PricingTab>> = [
    { value: "vehicles", label: "Loại phương tiện" },
    { value: "turn", label: "Dịch vụ gửi xe lượt" },
    { value: "monthly", label: "Dịch vụ gửi xe tháng" },
  ];

  return (
    <div className="sp-page">
      <Topbar
        title="Cài đặt"
        breadcrumbs={[{ label: "Cài đặt", page: "settings" }, "Bảng giá"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden">
          <Card className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-0">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Quay lại cài đặt"
                  onClick={() => navigate("settings")}
                >
                  <ArrowLeft />
                </Button>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-strong">
                    Cài đặt phí dịch vụ
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Quản lý Loại phương tiện và dịch vụ gửi xe theo từng nhóm phí.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeTab === "vehicles" ? (
                  <Button variant="outline" size="md" onClick={() => setVehicleGroupOpen(true)}>
                    <Settings2 />
                    Cấu hình nhóm xe
                  </Button>
                ) : null}
                <Button
                  size="md"
                  onClick={() => {
                    if (activeTab === "monthly") {
                      setMonthlyDrawerState({ open: true, mode: "create" });
                    }
                  }}
                >
                  <Plus />
                  Thêm mới
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} items={tabs} onValueChange={setActiveTab} />

            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              {activeTab === "vehicles" ? (
                <VehicleTypeTable />
              ) : activeTab === "monthly" ? (
                <MonthlyServicePricingTable
                  rows={monthlyRows}
                  onOpenDetail={(row) => {
                    setMonthlyDrawerState({ open: true, mode: "view", row });
                  }}
                  onEdit={(row) => {
                    setMonthlyDrawerState({ open: true, mode: "edit", row });
                  }}
                  onDuplicate={(row) => {
                    const nextRow = {
                      ...row,
                      id: Math.max(0, ...monthlyRows.map((item) => item.id)) + 1,
                      service: `${row.service} - Sao chép`,
                    };

                    setMonthlyRows((current) => [...current, nextRow]);
                    toastMessage.success("Đã nhân bản cài đặt gửi xe tháng", nextRow.service);
                  }}
                  onDelete={(row) => {
                    setMonthlyRows((current) => current.filter((item) => item.id !== row.id));
                    toastMessage.success("Đã xóa cài đặt gửi xe tháng", row.service);
                  }}
                />
              ) : (
                <ServicePricingTable key={activeTab} title={serviceTitle} rows={serviceRows} />
              )}
            </div>
          </Card>
        </section>
      </div>
      <VehicleGroupDrawer
        open={vehicleGroupOpen}
        onClose={() => setVehicleGroupOpen(false)}
      />
      <MonthlyPricingDrawer
        state={monthlyDrawerState}
        rowsCount={monthlyRows.length}
        onClose={() => setMonthlyDrawerState((current) => ({ ...current, open: false }))}
        onSave={(row) => {
          setMonthlyRows((current) =>
            current.some((item) => item.id === row.id)
              ? current.map((item) => (item.id === row.id ? row : item))
              : [...current, row],
          );
        }}
      />
    </div>
  );
}
