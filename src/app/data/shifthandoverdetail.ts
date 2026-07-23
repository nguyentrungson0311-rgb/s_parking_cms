import type { ShiftAssign } from "@/app/types";

export type ShiftHandoverDetailSection =
  | "slots"
  | "monthly"
  | "daily"
  | "outside"
  | "profit"
  | "report";

export type ShiftSlotView = "table" | "grid";

export type ShiftHandoverSectionItem = {
  id: ShiftHandoverDetailSection;
  label: string;
  group: "handover" | "summary";
  icon: string;
};

export type ShiftSlotRow = {
  id: string;
  vehicleType: string;
  icon: string;
  toneClass: string;
  fillColor: string;
  softColor: string;
  totalSlots: number;
  openingInside: number;
  monthlyInside: number;
  dailyInside: number;
};

const SLOT_EMPTY_COLOR = "#D9D9DC";

export const shiftHandoverSections: ShiftHandoverSectionItem[] = [
  { id: "slots", label: "Chỗ trống", group: "handover", icon: "bi-p-square-fill" },
  { id: "monthly", label: "Vé tháng", group: "handover", icon: "bi-credit-card-2-front-fill" },
  { id: "daily", label: "Vé ngày", group: "handover", icon: "bi-ticket-perforated-fill" },
  { id: "outside", label: "Vé ngoài", group: "handover", icon: "bi-person-badge-fill" },
  { id: "profit", label: "Lợi nhuận", group: "summary", icon: "bi-bar-chart-fill" },
  { id: "report", label: "Tạo báo cáo", group: "summary", icon: "bi-file-earmark-check-fill" },
];

export const shiftSlotRows: ShiftSlotRow[] = [
  {
    id: "car",
    vehicleType: "Ô tô",
    icon: "bi-car-front-fill",
    toneClass: "bg-purple-soft text-purple",
    fillColor: "var(--sp-purple)",
    softColor: SLOT_EMPTY_COLOR,
    totalSlots: 450,
    openingInside: 318,
    monthlyInside: 210,
    dailyInside: 96,
  },
  {
    id: "motorbike",
    vehicleType: "Xe máy",
    icon: "two_wheeler",
    toneClass: "bg-orange-soft text-orange",
    fillColor: "var(--sp-orange)",
    softColor: SLOT_EMPTY_COLOR,
    totalSlots: 1200,
    openingInside: 784,
    monthlyInside: 450,
    dailyInside: 312,
  },
  {
    id: "electric-bike",
    vehicleType: "Xe máy điện",
    icon: "bi-lightning-charge-fill",
    toneClass: "bg-cyan/10 text-cyan",
    fillColor: "var(--sp-cyan)",
    softColor: SLOT_EMPTY_COLOR,
    totalSlots: 180,
    openingInside: 106,
    monthlyInside: 62,
    dailyInside: 48,
  },
  {
    id: "bicycle",
    vehicleType: "Xe đạp",
    icon: "pedal_bike",
    toneClass: "bg-blue-soft text-blue",
    fillColor: "var(--sp-blue)",
    softColor: SLOT_EMPTY_COLOR,
    totalSlots: 260,
    openingInside: 132,
    monthlyInside: 72,
    dailyInside: 54,
  },
];

export const shiftTicketSectionMap: Partial<
  Record<ShiftHandoverDetailSection, ShiftAssign["ticketType"]>
> = {
  monthly: "Vé tháng",
  daily: "Vé ngày",
  outside: "Vé ngoài",
};

export const shiftProfitSummaryCards = [
  { label: "Doanh thu vé tháng", value: "24.800.000đ" },
  { label: "Doanh thu vé ngày", value: "8.460.000đ" },
  { label: "Doanh thu vé ngoài", value: "3.120.000đ" },
  { label: "Lợi nhuận tạm tính", value: "36.380.000đ" },
];
