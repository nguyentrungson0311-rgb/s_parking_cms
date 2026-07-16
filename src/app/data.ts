import type { Vehicle } from "./types";
import {
  BarChart3,
  CircleParking,
  Coins,
  CreditCard,
  ShieldCheck,
  TicketCheck,
  UsersRound,
} from "lucide-react";

export const metrics = [
  {
    label: "Tổng doanh thu",
    value: "482,5M",
    change: "+12.8%",
    icon: Coins,
    tone: "blue",
  },
  {
    label: "Số chỗ ô tô sử dụng",
    value: "7.056",
    change: "Tổng : 200 chỗ",
    icon: TicketCheck,
    tone: "purple",
  },
  {
    label: "Ca -1",
    value: "512",
    change: "Đang đỗ",
    icon: CircleParking,
    tone: "orange",
  },
  {
    label: "Vé tháng đang sử dụng",
    value: "2400",
    change: "Tổng :4000 thẻ",
    icon: ShieldCheck,
    tone: "green",
  },
];

export const trafficData = [
  { time: "06:00", cars: 420, bikes: 860, revenue: 42 },
  { time: "08:00", cars: 980, bikes: 1450, revenue: 88 },
  { time: "10:00", cars: 740, bikes: 1180, revenue: 73 },
  { time: "12:00", cars: 860, bikes: 1280, revenue: 81 },
  { time: "14:00", cars: 690, bikes: 1030, revenue: 66 },
  { time: "16:00", cars: 1120, bikes: 1510, revenue: 104 },
  { time: "18:00", cars: 1310, bikes: 1720, revenue: 126 },
  { time: "20:00", cars: 880, bikes: 1100, revenue: 82 },
];

export const cardStats = [
  { title: "Thẻ nội bộ", count: "300", value: "98%", tone: "info" },
  { title: "Thẻ cư dân", count: "986", value: "92%", tone: "success" },
  { title: "Vé lượt", count: "5.822", value: "76%", tone: "warning" },
];

export const occupancy = [
  { name: "Ô tô", value: 38, count: "1.520", color: "#7B66F6" },
  { name: "Xe máy", value: 31, count: "2.860", color: "#F57672" },
  { name: "Xe đạp", value: 18, count: "420", color: "#3BC0D5" },
  { name: "Còn trống", value: 13, count: "360", color: "#D9D9DC" },
];



export const cardProfile = {
  cardId: "C-1042",
  status: "Đang hoạt động",
  holder: "Nguyễn An",
  phone: "0903 118 228",
  unit: "Sảnh A · Tòa S1 · Căn A-1206",
  vehicle: "51F-824.19",
  package: "Thẻ tháng cư dân",
  validFrom: "01/07/2026",
  validTo: "31/07/2026",
  balance: "1.240.000đ",
  autoRenew: "Bật",
};

export const cardLogs = [
  { time: "09:42", action: "Vào bãi", gate: "Gate A1", result: "Hợp lệ" },
  { time: "08:05", action: "Ra bãi", gate: "Gate A2", result: "Hợp lệ" },
  { time: "18:24", action: "Vào bãi", gate: "Gate B2", result: "Camera khớp biển số" },
  { time: "17:58", action: "Thanh toán", gate: "Ví cư dân", result: "Gia hạn gói tháng" },
];
