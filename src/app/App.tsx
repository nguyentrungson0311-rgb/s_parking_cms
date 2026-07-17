import { useState } from "react";
import { AppShell } from "@/app/components/layout/AppShell";
import { Atoms } from "@/app/pages/Atoms";
import { DailyCard } from "@/app/pages/DailyCard";
import { Dashboard } from "@/app/pages/Dashboard";
import { ExternalCard } from "@/app/pages/ExternalCard";
import { MonthlyCardDetail } from "@/app/pages/MonthlyCardDetail";
import { MonthlyReport } from "@/app/pages/MonthlyReport";
import { MonthlyVehicle } from "@/app/pages/MonthlyVehicle";
import { PlaceholderPage } from "@/app/pages/PlaceholderPage";
import { ShiftAssign } from "@/app/pages/ShiftAssign";
import type { PageId } from "@/app/types";

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
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [detailOpen, setDetailOpen] = useState(false);
  const isVehiclePage = vehiclePages.includes(activePage);

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === "dashboard" && <Dashboard />}
      {activePage === "vehicle-day" && <DailyCard />}
      {activePage === "vehicle-outside" && <ExternalCard />}
      {activePage === "shift-handover" && <ShiftAssign />}
      {isVehiclePage && (
        <MonthlyVehicle
          title={pageTitles[activePage] ?? "Quản lý phương tiện"}
          onOpenDetail={() => setDetailOpen(true)}
        />
      )}
      {activePage === "overdue-vehicles" && (
        <PlaceholderPage title={pageTitles[activePage] ?? ""} parent="Quản lý phương tiện" />
      )}
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
      <MonthlyCardDetail open={detailOpen} onClose={() => setDetailOpen(false)} />
    </AppShell>
  );
}
