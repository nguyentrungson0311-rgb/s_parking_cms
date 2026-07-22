export type VehicleTypeSettingRow = {
  id: number;
  type: string;
  group: string;
  code: string;
  status: string;
};

export type VehicleGroupSettingRow = {
  id: number;
  displayOrder: number;
  name: string;
  vehicleTypes: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: string;
};

export type PricingServiceRow = {
  id: number;
  service: string;
  vehicleType: string;
  priceType: string;
  price: string;
  effectiveDate: string;
  expiredDate: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  status: string;
};

export type MonthlyPricingRow = Omit<PricingServiceRow, "vehicleType" | "price"> & {
  newRegistrationRule: string;
  newRegistrationThreshold: string;
  cancellationRule: string;
  cancellationThreshold: string;
  note: string;
};

export type MonthlyVehicleFeeRow = {
  id: number;
  displayOrder: number;
  vehicleGroup: string;
  configName: string;
  fromVehicle: number;
  toVehicle: number;
  price: string;
};

export const vehicleTypeRows: VehicleTypeSettingRow[] = [
  { id: 1, type: "Ô tô", group: "Ô tô/Ô tô điện", code: "CAR", status: "Đang sử dụng" },
  { id: 2, type: "Xe máy", group: "Xe máy/Xe máy điện", code: "MOTORBIKE", status: "Đang sử dụng" },
  { id: 3, type: "Xe máy điện", group: "Xe máy/Xe máy điện", code: "E-MOTORBIKE", status: "Đang sử dụng" },
  { id: 4, type: "Xe đạp", group: "Xe đạp", code: "BICYCLE", status: "Đang sử dụng" },
  { id: 5, type: "Xe đạp điện", group: "Xe đạp điện", code: "E-BICYCLE", status: "Đang sử dụng" },
];

export const vehicleGroupRows: VehicleGroupSettingRow[] = [
  {
    id: 1,
    displayOrder: 1,
    name: "Xe máy/Xe máy điện",
    vehicleTypes: ["Xe máy", "Xe máy điện"],
    createdBy: "admin.cms",
    createdAt: "2026-05-19 09:00:00",
    updatedBy: "ngocanh.cms",
    updatedAt: "2026-05-19 11:26:00",
    status: "Đang sử dụng",
  },
  {
    id: 2,
    displayOrder: 2,
    name: "Ô tô/Ô tô điện",
    vehicleTypes: ["Ô tô", "Ô tô điện"],
    createdBy: "admin.cms",
    createdAt: "2026-05-19 09:00:00",
    updatedBy: "ngocanh.cms",
    updatedAt: "2026-05-19 11:26:00",
    status: "Chưa sử dụng",
  },
  {
    id: 3,
    displayOrder: 3,
    name: "Xe đạp",
    vehicleTypes: ["Xe đạp"],
    createdBy: "admin.cms",
    createdAt: "2026-05-19 09:00:00",
    updatedBy: "ngocanh.cms",
    updatedAt: "2026-05-19 11:26:00",
    status: "Ngừng sử dụng",
  },
  {
    id: 4,
    displayOrder: 4,
    name: "Xe đạp điện",
    vehicleTypes: ["Xe đạp điện"],
    createdBy: "admin.cms",
    createdAt: "2026-05-19 09:00:00",
    updatedBy: "ngocanh.cms",
    updatedAt: "2026-05-19 11:26:00",
    status: "Đang sử dụng",
  },
];

export const turnServiceRows: PricingServiceRow[] = [
  {
    id: 1,
    service: "Vé lượt ô tô",
    vehicleType: "Ô tô",
    priceType: "Theo giờ",
    price: "25.000đ",
    effectiveDate: "20/10/2025",
    expiredDate: "20/10/2026",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Đang sử dụng",
  },
  {
    id: 2,
    service: "Vé lượt xe máy",
    vehicleType: "Xe máy",
    priceType: "Theo lượt",
    price: "5.000đ",
    effectiveDate: "20/10/2025",
    expiredDate: "--",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Đang sử dụng",
  },
  {
    id: 3,
    service: "Vé lượt xe điện",
    vehicleType: "Xe máy điện",
    priceType: "Theo lượt",
    price: "6.000đ",
    effectiveDate: "20/10/2025",
    expiredDate: "--",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Ngừng sử dụng",
  },
];

export const monthlyServiceRows: MonthlyPricingRow[] = [
  {
    id: 1,
    service: "Cư dân",
    priceType: "Cư dân",
    effectiveDate: "20/10/2025",
    expiredDate: "20/10/2026",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Đang sử dụng",
    newRegistrationRule: "Tính phí nửa tháng - Theo khoảng ngày",
    newRegistrationThreshold: "15",
    cancellationRule: "Tính phí nửa tháng - Theo khoảng ngày",
    cancellationThreshold: "15",
    note: "--",
  },
  {
    id: 2,
    service: "Cho thuê",
    priceType: "Cho thuê",
    effectiveDate: "20/10/2025",
    expiredDate: "--",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Đang sử dụng",
    newRegistrationRule: "Tính phí cả tháng",
    newRegistrationThreshold: "1",
    cancellationRule: "Không hoàn phí",
    cancellationThreshold: "1",
    note: "--",
  },
  {
    id: 3,
    service: "Dịch vụ",
    priceType: "Dịch vụ",
    effectiveDate: "20/10/2025",
    expiredDate: "--",
    createdBy: "admin.cms",
    createdAt: "2026-05-14 09:00:00",
    updatedBy: "ngocanh.cms",
    status: "Ngừng sử dụng",
    newRegistrationRule: "Tính phí nửa tháng - Theo khoảng ngày",
    newRegistrationThreshold: "15",
    cancellationRule: "Không hoàn phí",
    cancellationThreshold: "1",
    note: "--",
  },
];

export const monthlyVehicleFeeRows: MonthlyVehicleFeeRow[] = [
  {
    id: 1,
    displayOrder: 0,
    vehicleGroup: "Xe máy",
    configName: "Xe máy từ xe 1 đến xe 5",
    fromVehicle: 1,
    toVehicle: 5,
    price: "120.000",
  },
  {
    id: 2,
    displayOrder: 1,
    vehicleGroup: "Xe máy",
    configName: "Xe máy từ xe 6 đến xe 10",
    fromVehicle: 6,
    toVehicle: 10,
    price: "100.000",
  },
  {
    id: 3,
    displayOrder: 2,
    vehicleGroup: "Ô tô",
    configName: "Ô tô từ xe 1 đến xe 5",
    fromVehicle: 1,
    toVehicle: 5,
    price: "550.000",
  },
  {
    id: 4,
    displayOrder: 3,
    vehicleGroup: "Ô tô",
    configName: "Ô tô từ xe 6 đến xe 10",
    fromVehicle: 6,
    toVehicle: 10,
    price: "520.000",
  },
  {
    id: 5,
    displayOrder: 4,
    vehicleGroup: "Ô tô",
    configName: "Ô tô từ xe 11 đến xe 20",
    fromVehicle: 11,
    toVehicle: 20,
    price: "500.000",
  },
];
