import { useState, useRef } from "react";
import { MagnifyingGlassIcon, DocumentTextIcon, ArrowDownTrayIcon, ChartBarIcon, FunnelIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { CommonTable, ColumnDef } from "../components/common/CommonTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input, DateInput } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/common/PageHeader";

// Interfaces for different report types
interface OverviewRecord {
  id: number;
  category: string;
  total: number;
  active: number;
  inactive: number;
  revenue: string;
  growth: string;
}

interface ResidentRecord {
  id: number;
  name: string;
  idNumber: string;
  phone: string;
  apartment: string;
  registrationDate: string;
  status: string;
}

interface ApartmentRecord {
  id: number;
  apartmentCode: string;
  building: string;
  area: string;
  floor: string;
  owner: string;
  status: string;
}

interface RevenueRecord {
  id: number;
  project: string;
  building: string;
  area: string;
  floor: string;
  floorType: string;
  createdDate: string;
}

interface CardRecord {
  id: number;
  cardType: string;
  cardNumber: string;
  owner: string;
  apartment: string;
  issueDate: string;
  status: string;
}

interface TechnicalRecord {
  id: number;
  equipment: string;
  location: string;
  maintenanceType: string;
  technician: string;
  date: string;
  status: string;
}

type ReportType = "overview" | "residents" | "apartments" | "revenue" | "cards" | "technical";

// Report configuration with viewable/downloadOnly flag
interface ReportConfig {
  id: ReportType;
  label: string;
  description: string;
  viewable: boolean; // true = show table + save button, false = show download only
}

interface ReportHRMProps {
  onBack: () => void;
}

// Empty State Component
function EmptyState({ reportTitle }: { reportTitle: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-[440px]">
        <div className="w-[80px] h-[80px] rounded-full bg-badge-neutral-bg flex items-center justify-center mb-3">
          <DocumentTextIcon className="w-[40px] h-[40px] text-muted-foreground" />
        </div>
        <h3 className="text-foreground mb-3 text-lg font-semibold">
          {reportTitle}
        </h3>
        <p className="text-muted-foreground mb-3 text-sm">
          Danh sách thay đổi nhân sự
        </p>
        <p className="text-muted-foreground text-sm">
          Chọn tham số thời gian và nhấn <span className="text-foreground font-medium">Lọc (F2)</span> để xem dữ liệu
        </p>
      </div>
    </div>
  );
}

// Download Only State Component
function DownloadOnlyState({ reportTitle, onDownload }: { reportTitle: string; onDownload: () => void }) {
  const currentDate = new Date().toLocaleDateString('vi-VN');
  
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-[440px]">
        <div className="w-[80px] h-[80px] rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <ArrowDownTrayIcon className="w-[32px] h-[32px] text-primary" />
        </div>
        <h3 className="text-primary mb-3 text-lg font-semibold">
          Tạo file báo cáo
        </h3>
        <p className="text-muted-foreground mb-3 text-sm">
          Chọn điều kiện mong muốn.
        </p>
        <p className="text-muted-foreground mb-3 text-sm">
          Nhấn nút bên dưới để tạo và tải xuống file Excel.
        </p>
        
        <button
          onClick={onDownload}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 flex items-center gap-2 transition-colors mb-3 rounded-lg text-sm font-medium"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span>Tải xuống báo cáo Excel</span>
        </button>
        
        <p className="text-primary text-sm">
          Thời gian: {currentDate}
        </p>
      </div>
    </div>
  );
}

// Menu Item Component
function MenuItem({ 
  number, 
  title, 
  description, 
  isActive 
}: { 
  number: number; 
  title: string; 
  description: string; 
  isActive: boolean;
}) {
  return (
    <div className="flex gap-3 px-2 py-3">
      <div className="w-4 h-8 pt-0.5 text-muted-foreground rounded-full flex justify-center shrink-0 text-sm font-medium">
        {number}
      </div>
      <div className="flex flex-col text-left">
        <h3 className={`${isActive ? 'text-primary' : 'text-foreground'}`}>
          {title}
        </h3>
        <div className="text-muted-foreground text-sm">
          {description}
        </div>
      </div>
    </div>
  );
}

export function ReportHRM({ onBack }: ReportHRMProps) {
  const [activeReport, setActiveReport] = useState<ReportType>("revenue");
  const [filterType, setFilterType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("24/12/2025");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Generate mock data for Overview Report
  const generateOverviewData = (): OverviewRecord[] => {
    return [
      { id: 1, category: "Tổng số căn hộ", total: 482, active: 450, inactive: 32, revenue: "45.2 tỷ", growth: "+12.5%" },
      { id: 2, category: "Cư dân đăng ký", total: 1250, active: 1180, inactive: 70, revenue: "32.8 tỷ", growth: "+8.3%" },
      { id: 3, category: "Thẻ ra vào", total: 2340, active: 2200, inactive: 140, revenue: "15.6 tỷ", growth: "+5.7%" },
      { id: 4, category: "Phương tiện", total: 856, active: 820, inactive: 36, revenue: "8.4 tỷ", growth: "+3.2%" },
      { id: 5, category: "Dịch vụ kỹ thuật", total: 124, active: 118, inactive: 6, revenue: "22.1 tỷ", growth: "+15.8%" },
    ];
  };

  // Generate mock data for Residents Report
  const generateResidentsData = (): ResidentRecord[] => {
    const names = ["Nguyễn Văn An", "Trần Thị Bình", "Lê Hoàng Cường", "Phạm Thị Dung", "Hoàng Văn Em", "Vũ Thị Phương"];
    const statuses = ["Đang ở", "Đã chuyển đi", "Tạm vắng"];
    const records: ResidentRecord[] = [];
    
    for (let i = 1; i <= 150; i++) {
      records.push({
        id: i,
        name: names[i % names.length],
        idNumber: `0${(i % 9) + 1}${i.toString().padStart(8, '0')}`,
        phone: `098${i.toString().padStart(7, '0')}`,
        apartment: `A${Math.floor(i / 10) + 1}.${(i % 10) + 1}`,
        registrationDate: `${(i % 28) + 1}/10/2025`,
        status: statuses[i % statuses.length],
      });
    }
    return records;
  };

  // Generate mock data for Apartments Report
  const generateApartmentsData = (): ApartmentRecord[] => {
    const buildings = ["Tòa A", "Tòa B", "Tòa C", "Tòa D"];
    const areas = ["The Golf Mansion", "Park View", "City Center", "River Side"];
    const owners = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];
    const statuses = ["Đang ở", "Trống", "Đang sửa chữa"];
    const records: ApartmentRecord[] = [];
    
    for (let i = 1; i <= 482; i++) {
      const floor = i <= 10 ? `B${i}` : `Tầng ${(i % 30) + 1}`;
      records.push({
        id: i,
        apartmentCode: `${buildings[i % buildings.length]}-${floor}-${(i % 8) + 1}`,
        building: buildings[i % buildings.length],
        area: areas[i % areas.length],
        floor: floor,
        owner: owners[i % owners.length],
        status: statuses[i % statuses.length],
      });
    }
    return records;
  };

  // Generate mock data for Revenue Report
  const generateRevenueData = (): RevenueRecord[] => {
    const projects = ["Noble Palace Tay Ho", "Golden Mansion", "Royal Tower", "Sky Villa"];
    const buildings = ["Tòa A", "Tòa B", "Tòa C", "Tòa D"];
    const areas = ["The Golf Mansion", "Park View", "City Center", "River Side"];
    const floorTypes = ["Tầng hầm", "Shophouse", "Văn phòng", "Sảnh", "Căn hộ"];
    
    const records: RevenueRecord[] = [];
    for (let i = 1; i <= 482; i++) {
      const floorNumber = i <= 10 ? `B${i}` : i <= 20 ? `Tầng ${i - 10}` : `Tầng ${(i % 30) + 1}`;
      records.push({
        id: i,
        project: projects[i % projects.length],
        building: buildings[i % buildings.length],
        area: areas[i % areas.length],
        floor: floorNumber,
        floorType: floorTypes[i % floorTypes.length],
        createdDate: "20/10/2025",
      });
    }
    return records;
  };

  // Generate mock data for Cards & Vehicles Report
  const generateCardsData = (): CardRecord[] => {
    const cardTypes = ["Thẻ cư dân", "Thẻ xe ô tô", "Thẻ xe máy", "Thẻ khách"];
    const owners = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D"];
    const statuses = ["Đang hoạt động", "Tạm khóa", "Đã hủy"];
    const records: CardRecord[] = [];
    
    for (let i = 1; i <= 320; i++) {
      records.push({
        id: i,
        cardType: cardTypes[i % cardTypes.length],
        cardNumber: `BZ${i.toString().padStart(8, '0')}`,
        owner: owners[i % owners.length],
        apartment: `A${Math.floor(i / 10) + 1}.${(i % 10) + 1}`,
        issueDate: `${(i % 28) + 1}/10/2025`,
        status: statuses[i % statuses.length],
      });
    }
    return records;
  };

  // Generate mock data for Technical Operations Report
  const generateTechnicalData = (): TechnicalRecord[] => {
    const equipments = ["Thang máy #1", "Máy bơm nước", "Hệ thống điện", "PCCC tầng 5", "Điều hòa sảnh", "Camera an ninh"];
    const locations = ["Tòa A - Tầng 1", "Tòa B - Tầng 3", "Tòa C - Tầng 5", "Tòa D - Sảnh"];
    const maintenanceTypes = ["Bảo trì định kỳ", "Sửa chữa", "Kiểm tra", "Thay thế"];
    const technicians = ["Nguyễn Văn Tèo", "Trần Văn Ti", "Lê Văn Tí", "Phạm Văn Tý"];
    const statuses = ["Hoàn thành", "Đang thực hiện", "Chờ xử lý"];
    const records: TechnicalRecord[] = [];
    
    for (let i = 1; i <= 124; i++) {
      records.push({
        id: i,
        equipment: equipments[i % equipments.length],
        location: locations[i % locations.length],
        maintenanceType: maintenanceTypes[i % maintenanceTypes.length],
        technician: technicians[i % technicians.length],
        date: `${(i % 28) + 1}/11/2025`,
        status: statuses[i % statuses.length],
      });
    }
    return records;
  };

  // Report types configuration with viewable flag
  const reportTypes: ReportConfig[] = [
    { id: "overview", label: "BC SL nhân sự ", description: "Báo cáo tống hợp chi tiết", viewable: true },
    { id: "residents", label: "BC SL nhân sự nghỉ việc", description: "Báo cáo tống hợp chi tiết", viewable: false },
    { id: "apartments", label: "BC DS nhân sự nghỉ việc", description: "Báo cáo tống hợp chi tiết", viewable: true },
    { id: "revenue", label: "BC nhân sự vào tập đoàn", description: "Báo cáo tống hợp chi tiết", viewable: true },
    { id: "cards", label: "BC DS nhân sự điều chuyển", description: "Báo cáo tống hợp chi tiết", viewable: false },
    { id: "technical", label: "BC SL nhân sự điều chuyển", description: "Báo cáo tống hợp chi tiết", viewable: true },
  ];

  const getReportConfig = () => {
    return reportTypes.find((r) => r.id === activeReport);
  };

  const getReportTitle = () => {
    const report = getReportConfig();
    return report?.label || "Báo cáo";
  };

  const isReportViewable = () => {
    const report = getReportConfig();
    return report?.viewable ?? true;
  };

  // Status Badge Component
  const StatusBadge = ({ status, label }: { status: string; label: string }) => {
    const getStatusColor = () => {
      if (status === "active" || status === "Đang ở" || status === "Đang hoạt động" || status === "Hoàn thành") {
        return "bg-green-100 text-green-700 border-green-200";
      } else if (status === "cancelled" || status === "Đã chuyển đi" || status === "Đã hủy") {
        return "bg-red-100 text-red-700 border-red-200";
      } else if (status === "pending" || status === "Tạm vắng" || status === "Tạm khóa" || status === "Đang thực hiện" || status === "Chờ xử lý") {
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      } else if (status === "empty" || status === "Trống") {
        return "bg-gray-100 text-gray-700 border-gray-200";
      }
      return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 border rounded-lg text-xs font-medium ${getStatusColor()}`}>
        {label}
      </span>
    );
  };

  // Define columns for Overview Report
  const overviewColumns: ColumnDef<OverviewRecord>[] = [
    {
      key: "category",
      header: "DANH MỤC",
      width: "w-[200px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.category}</span>,
    },
    {
      key: "total",
      header: "Tổng số",
      width: "w-[120px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.total.toLocaleString()}</span>,
    },
    {
      key: "active",
      header: "Đang hoạt động",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.active.toLocaleString()}</span>,
    },
    {
      key: "inactive",
      header: "Không hoạt động",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.inactive.toLocaleString()}</span>,
    },
    {
      key: "revenue",
      header: "Doanh thu",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.revenue}</span>,
    },
    {
      key: "growth",
      header: "Tăng trưởng",
      render: (row) => (
        <span className={`whitespace-nowrap text-sm ${row.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {row.growth}
        </span>
      ),
    },
  ];

  // Define columns for Residents Report
  const residentsColumns: ColumnDef<ResidentRecord>[] = [
    {
      key: "name",
      header: "HỌ VÀ TÊN",
      width: "w-[180px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.name}</span>,
    },
    {
      key: "idNumber",
      header: "CCCD",
      width: "w-[140px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.idNumber}</span>,
    },
    {
      key: "phone",
      header: "Số điện thoại",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.phone}</span>,
    },
    {
      key: "apartment",
      header: "Căn hộ",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.apartment}</span>,
    },
    {
      key: "registrationDate",
      header: "Ngày đăng ký",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.registrationDate}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ];

  // Define columns for Apartments Report
  const apartmentsColumns: ColumnDef<ApartmentRecord>[] = [
    {
      key: "apartmentCode",
      header: "MÃ CĂN HỘ",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.apartmentCode}</span>,
    },
    {
      key: "building",
      header: "Tòa nhà",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.building}</span>,
    },
    {
      key: "area",
      header: "Khu vực",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.area}</span>,
    },
    {
      key: "floor",
      header: "Tầng",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.floor}</span>,
    },
    {
      key: "owner",
      header: "Chủ sở hữu",
      width: "w-[140px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.owner}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ];

  // Define columns for Revenue Report
  const revenueColumns: ColumnDef<RevenueRecord>[] = [
    {
      key: "project",
      header: "DỰ ÁN",
      width: "w-[200px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.project}</span>,
    },
    {
      key: "building",
      header: "TÒA NHÀ",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.building}</span>,
    },
    {
      key: "area",
      header: "KHU VỰC",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.area}</span>,
    },
    {
      key: "floor",
      header: "TẦNG",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.floor}</span>,
    },
    {
      key: "floorType",
      header: "LOẠI TẦNG",
      width: "w-[120px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.floorType}</span>,
    },
    {
      key: "createdDate",
      header: "NGÀY TẠO",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.createdDate}</span>,
    },
  ];

  // Define columns for Cards Report
  const cardsColumns: ColumnDef<CardRecord>[] = [
    {
      key: "cardType",
      header: "LOẠI THẺ",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.cardType}</span>,
    },
    {
      key: "cardNumber",
      header: "SỐ THẺ",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.cardNumber}</span>,
    },
    {
      key: "owner",
      header: "Chủ sở hữu",
      width: "w-[140px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.owner}</span>,
    },
    {
      key: "apartment",
      header: "Căn hộ",
      width: "w-[100px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.apartment}</span>,
    },
    {
      key: "issueDate",
      header: "Ngày cấp",
      width: "w-[120px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.issueDate}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ];

  // Define columns for Technical Report
  const technicalColumns: ColumnDef<TechnicalRecord>[] = [
    {
      key: "equipment",
      header: "Thiết bị",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.equipment}</span>,
    },
    {
      key: "location",
      header: "Vị trí",
      width: "w-[140px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.location}</span>,
    },
    {
      key: "maintenanceType",
      header: "Loại công việc",
      width: "w-[150px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.maintenanceType}</span>,
    },
    {
      key: "technician",
      header: "Nhân viên",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.technician}</span>,
    },
    {
      key: "date",
      header: "Ngày thực hiện",
      width: "w-[130px]",
      render: (row) => <span className="text-foreground whitespace-nowrap text-sm">{row.date}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (row) => <StatusBadge status={row.status} label={row.status} />,
    },
  ];

  // Get current data and columns based on active report
  const getCurrentData = () => {
    switch (activeReport) {
      case "overview":
        return generateOverviewData();
      case "residents":
        return generateResidentsData();
      case "apartments":
        return generateApartmentsData();
      case "revenue":
        return generateRevenueData();
      case "cards":
        return generateCardsData();
      case "technical":
        return generateTechnicalData();
      default:
        return generateRevenueData();
    }
  };

  const getCurrentColumns = () => {
    switch (activeReport) {
      case "overview":
        return overviewColumns;
      case "residents":
        return residentsColumns;
      case "apartments":
        return apartmentsColumns;
      case "revenue":
        return revenueColumns;
      case "cards":
        return cardsColumns;
      case "technical":
        return technicalColumns;
      default:
        return revenueColumns;
    }
  };

  // Handle export/download
  const handleExport = () => {
    console.log(`Exporting ${getReportTitle()} to Excel`);
    // In a real app, this would export data to Excel
  };

  // Render content based on filter state and report type
  const renderContent = () => {
    if (!hasFiltered) {
      return <EmptyState reportTitle={getReportTitle()} />;
    }

    if (!isReportViewable()) {
      return <DownloadOnlyState reportTitle={getReportTitle()} onDownload={handleExport} />;
    }

    // Show table for viewable reports after filtering
    return (
      <>
        {/* Header with report title and Save button */}
        <div className="shrink-0 pl-5 pb-3 flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">
            {getReportTitle()}
          </h2>
          <button
            onClick={handleExport}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 flex items-center gap-2 transition-colors rounded-lg text-sm font-medium"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Lưu
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden pl-5 ">
          <CommonTable
            data={getCurrentData()}
            columns={getCurrentColumns()}
            rowKey={(row: any) => String(row.id)}
            pagination={{
              enabled: true,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50, 100],
            }}
            maxHeight="calc(100vh - 0px)"
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 bg-badge-neutral-bg overflow-auto pb-4 pr-4">
      <div className=" overflow-hidden h-full flex flex-col rounded-xl">
        {/* Header "Báo cáo" chung */}
        <div className=" relative shrink-0 w-full  rounded-t-xl">
          <div className="flex gap-3 items-center  relative w-full">
            <PageHeader 
              title="Báo cáo" 
              breadcrumbs={[
                { label: 'Trang chủ', onClick: onBack },
                { label: 'Báo cáo' }
              ]}
              bgColor="bg-badge-neutral-bg"
            />
            <div className="flex-1" />
            {/* Filter controls on the right */}
            <div className="flex gap-3 items-center shrink-0">
              {/* Đơn vị / Chi nhánh dropdown */}
              <div className="w-[200px]">
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Đơn vị / Chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="hanoi">Hà Nội</SelectItem>
                    <SelectItem value="danang">Đà Nẵng</SelectItem>
                    <SelectItem value="cantho">Cần Thơ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phòng ban dropdown */}
              <div className="w-[200px]">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="hr">Nhân sự</SelectItem>
                    <SelectItem value="it">Công nghệ thông tin</SelectItem>
                    <SelectItem value="finance">Tài chính</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Kinh doanh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Dropdown filter type */}
              <div className="w-[160px]">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Theo ngày" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Theo ngày</SelectItem>
                    <SelectItem value="weekly">Theo tuần</SelectItem>
                    <SelectItem value="monthly">Theo tháng</SelectItem>
                    <SelectItem value="quarterly">Theo quý</SelectItem>
                    <SelectItem value="yearly">Theo năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Date picker */}
              <div className="w-[160px]">
                <DateInput 
                  value={selectedDate} 
                  onChange={(value) => setSelectedDate(value)}
                  placeholder="dd/mm/yyyy"
                />
              </div>
              
              {/* Lọc button */}
              <Button
                variant="secondary"
                onClick={() => setHasFiltered(true)}
              >
                <FunnelIcon className="w-5 h-5" />
                Lọc (F2)
              </Button>
            </div>
          </div>
        </div>

        {/* Container 2 cột: Sidebar + Content */}
        <div className="flex-1 overflow-hidden  pl-4 ">
          <div className="flex h-full overflow-hidden bg-badge-neutral-bg rounded-xl">
            {/* Cột trái: Sidebar */}
            <div className="bg-card h-full relative shrink-0 border border-border rounded-xl">
              <div className="flex flex-col h-full items-start overflow-clip py-3 px-3 relative w-[300px]">
                {/* Search Box */}
                <div className=" pb-3 w-full">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm báo cáo..."
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Report List */}
                <div className="flex flex-col gap-0 items-center w-full">
                  {reportTypes
                    .filter(report => 
                      searchQuery === "" || 
                      report.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      report.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((report, index) => (
                    <button
                      key={report.id}
                      onClick={() => {
                        setActiveReport(report.id);
                        setHasFiltered(false);
                      }}
                      className={`relative shrink-0 w-full transition-colors rounded-lg ${
                        activeReport === report.id ? "bg-primary/10 border-l-[2.5px] border-l-primary" : "hover:bg-badge-neutral-bg border-l-[2.5px] border-l-transparent"
                      }`}
                    >
                      <MenuItem
                        number={index + 1}
                        title={report.label}
                        description={report.description}
                        isActive={activeReport === report.id}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải: Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}