export type PageId =
  | "dashboard"
  | "vehicle-day"
  | "vehicle-month"
  | "vehicle-outside"
  | "shift-handover"
  | "overdue-vehicles"
  | "gate-management"
  | "reminders"
  | "ui-atoms"
  | "summary-vehicles"
  | "monthly-report"
  | "settings"
  | "settings-pricing";

export type MonthlyVehicleStatus =
  | "active"
  | "paymentOverdue"
  | "locked";

export type DailyCardStatus = "active" | "locked" | "expired";

export type ExternalCardStatus = "active" | "locked" | "paymentOverdue";

export type ShiftAssignStatus = "inYard" | "exited";

export type ShiftHandoverStatus =
  | "new"
  | "profitCalculated"
  | "reportPublished"
  | "locked";

export type ShiftCode = "Ca 1" | "Ca 2" | "Ca 3";

export type VehicleDisplayType = "Ô tô" | "Xe máy" | "Xe máy điện" | "Xe đạp";

export type TicketDisplayType = "Vé tháng" | "Vé lượt" | "Vé ngoài";

export interface Vehicle {
  id: string;
  lotCardNumber: string;
  deliveredAt: string;
  plate: string;
  vehicleName: string;
  paintColor: string;
  owner: string;
  phone: string;
  email: string;
  startedAt: string;
  endedAt: string;
  apartment: string;
  vehicleType: "Xe máy" | "Ô tô" | "Xe đạp";
  locked: boolean;
  used: boolean;
  usageCount: number;
  lastUsedAt: string;
  status: MonthlyVehicleStatus;
}

export interface DailyCard {
  id: string;
  cardNumber: string;
  importedAt: string;
  vehicleType: "Xe máy" | "Ô tô" | "Xe đạp";
  projectCode: string;
  lostReported: boolean;
  reportedAt: string;
  inUse: boolean;
  usageCount: number;
  lastUsedAt: string;
  status: DailyCardStatus;
}

export interface ExternalCard {
  id: string;
  lotCardNumber: string;
  issuedAt: string;
  owner: string;
  phone: string;
  plate: string;
  vehicleName: string;
  startedAt: string;
  endedAt: string;
  cardType: "Thẻ khách";
  cardNumber: string;
  vehicleType: "Xe máy" | "Ô tô" | "Xe đạp";
  deliveredAt: string;
  status: ExternalCardStatus;
}

export interface ShiftAssign {
  id: string;
  lotCardNumber: string;
  ticketNumber: string;
  cardCode: string;
  vehicleType: "Ô tô" | "Xe máy" | "Xe máy điện" | "Xe đạp";
  ticketType: "Vé tháng" | "Vé lượt";
  checkedInAt: string;
  checkedOutAt: string;
  payment: string;
  plate: string;
  customer: string;
  apartmentCode: string;
  vehicleName: string;
  shiftIn: ShiftCode;
  shiftOut: ShiftCode | "-";
  statusFlag: boolean;
  status: ShiftAssignStatus;
}

export interface ShiftHandoverBatch {
  id: string;
  code: string;
  name: string;
  shift: "Ca 1" | "Ca 2";
  date: string;
  fromTime: string;
  toTime: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: ShiftHandoverStatus;
}

export interface OverdueVehicle {
  id: string;
  lotCardNumber: string;
  ticketNumber: string;
  cardCode: string;
  vehicleType: VehicleDisplayType;
  ticketType: TicketDisplayType;
  checkedInAt: string;
  plateImageLabel: string;
  overviewImageLabel: string;
  recognitionText: string;
  customerName: string;
  apartment: string;
  vehicleName: string;
  plate: string;
  overdueDays: number;
}
