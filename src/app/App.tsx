import { useState } from "react";
import { AppShell } from "@/app/components/layout/AppShell";
import { Atoms } from "@/app/pages/Atoms";
import { DailyCard } from "@/app/pages/DailyCard";
import { Dashboard } from "@/app/pages/Dashboard";
import { ExternalCard } from "@/app/pages/ExternalCard";
import { MonthlyCardDetail } from "@/app/pages/MonthlyCardDetail";
import { MonthlyReport } from "@/app/pages/MonthlyReport";
import { MonthlyVehicle } from "@/app/pages/MonthlyVehicle";
import { OverdueVehicle } from "@/app/pages/OverdueVehicle";
import { PlaceholderPage } from "@/app/pages/PlaceholderPage";
import { PricingSettings } from "@/app/pages/PricingSettings";
import { Settings } from "@/app/pages/Settings";
import { ShiftAssign } from "@/app/pages/ShiftAssign";
import { Toaster } from "@/app/components/ui/toast";
import type { PageId } from "@/app/types";
import type { DynamicFormMode } from "@/app/components/ui/dynamic-form";

const vehiclePages: PageId[] = [
  "vehicle-month",
];

const pageTitles: Partial<Record<PageId, string>> = {
  "vehicle-day": "Quản lý vé ngày",
  "vehicle-month": "Quản lý vé tháng",
  "vehicle-outside": "Quản lý vé ngoài",
  "shift-handover": "Giao ca",
  "overdue-vehicles": "Xe để quá ngày",
  "gate-management": "Quản lý mở cổng",
  reminders: "Nhắc nhở",
  "ui-atoms": "Atom components",
  "summary-vehicles": "Quản lý xe",
  "monthly-report": "Báo cáo tháng",
  settings: "Cài đặt",
  "settings-pricing": "Cài đặt bảng giá",
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<DynamicFormMode>("view");
  const isVehiclePage = vehiclePages.includes(activePage);

  const openMonthlyCardDetail = (mode: DynamicFormMode = "view") => {
    setDetailMode(mode);
    setDetailOpen(true);
  };

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "vehicle-day" && <DailyCard />}
      {activePage === "vehicle-outside" && <ExternalCard />}
      {activePage === "shift-handover" && <ShiftAssign />}
      {isVehiclePage && (
        <MonthlyVehicle
          title={pageTitles[activePage] ?? "Quản lý phương tiện"}
          onOpenDetail={openMonthlyCardDetail}
        />
      )}
      {activePage === "overdue-vehicles" && <OverdueVehicle />}
      {activePage === "gate-management" && (
        <PlaceholderPage title={pageTitles[activePage] ?? ""} parent="Quản lý phương tiện" />
      )}
      {activePage === "reminders" && (
        <PlaceholderPage title={pageTitles[activePage] ?? ""} parent="Quản lý phương tiện" />
      )}
      {activePage === "ui-atoms" && <Atoms />}
      {activePage === "summary-vehicles" && (
        <PlaceholderPage title="Quản lý xe" parent="Tổng hợp" />
      )}
      {activePage === "monthly-report" && (
        <MonthlyReport />
      )}
      {activePage === "settings" && <Settings />}
      {activePage === "settings-pricing" && <PricingSettings />}
      <MonthlyCardDetail
        open={detailOpen}
        initialMode={detailMode}
        onClose={() => setDetailOpen(false)}
      />
      <Toaster />
    </AppShell>
  );
}
