import { useState } from "react";
import { Topbar } from "@/app/components/layout/Topbar";
import { useAppNavigation } from "@/app/components/layout/AppShell";
import { ComplexTableCard } from "@/app/components/common/ComplexTableCard";
import {
  MonthlyServicePricingTable,
  ServicePricingTable,
  VehicleTypeTable,
} from "@/app/components/setting/PricingSettingsTables";
import { Button } from "@/app/components/ui/button";
import type { DynamicFormMode } from "@/app/components/ui/dynamic-form";
import { type TabItem } from "@/app/components/ui/tabs";
import { toastMessage } from "@/app/components/ui/toast";
import { MonthlyPricingDrawer } from "@/app/pages/MonthlyPricingDrawer";
import { VehicleGroupDrawer } from "@/app/pages/VehicleGroupDrawer";
import {
  monthlyServiceRows,
  turnServiceRows,
  type MonthlyPricingRow,
} from "@/app/data/setting";
import { Plus, Settings2 } from "lucide-react";

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
          <ComplexTableCard
            title="Cài đặt phí dịch vụ"
            description="Quản lý Loại phương tiện và dịch vụ gửi xe theo từng nhóm phí."
            onBack={() => navigate("settings")}
            backLabel="Quay lại cài đặt"
            actions={
              <>
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
              </>
            }
            tabs={{ value: activeTab, items: tabs, onValueChange: setActiveTab }}
          >
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
          </ComplexTableCard>
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
