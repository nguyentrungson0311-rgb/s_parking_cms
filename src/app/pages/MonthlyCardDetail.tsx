import { useEffect, useState } from "react";
import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { DocumentUploadPanel } from "@/app/components/common/DocumentUploadPanel";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  DynamicFormCard,
  type DynamicFormField,
  type DynamicFormMode,
  type DynamicFormValues,
} from "@/app/components/ui/dynamic-form";
import { toastMessage } from "@/app/components/ui/toast";
import {
  Check,
  Edit3,
  RefreshCcw,
  Save,
  Ticket,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const ticketTypeOptions = [
  { value: "month", label: "Vé tháng" },
  { value: "day", label: "Vé ngày" },
  { value: "outside", label: "Vé ngoài" },
];

const statusOptions = [
  { value: "active", label: "Còn hiệu lực" },
  { value: "locked", label: "Tạm khóa" },
  { value: "expired", label: "Hết hạn" },
];

const ticketInfoFields: DynamicFormField[] = [
  {
    name: "cardCode",
    label: "Mã thẻ / vé",
    required: true,
  },
  {
    name: "ticketType",
    label: "Loại vé",
    type: "select",
    required: true,
    options: ticketTypeOptions,
  },
  {
    name: "status",
    label: "Trạng thái",
    type: "select",
    options: statusOptions,
  },
  {
    name: "ticketPackage",
    label: "Gói vé",
  },
  {
    name: "price",
    label: "Giá vé",
  },
  {
    name: "billingCycle",
    label: "Chu kỳ thanh toán",
  },
  {
    name: "owner",
    label: "Chủ thẻ",
    required: true,
    leftIcon: <UserRound className="size-4" />,
  },
  {
    name: "linkedVehicle",
    label: "Liên kết xe",
  },
  {
    name: "apartment",
    label: "Căn hộ",
  },
  {
    name: "issuedAt",
    label: "Ngày phát hành",
    type: "date",
  },
  {
    name: "expiredAt",
    label: "Ngày hết hạn",
    type: "date",
    required: true,
  },
  {
    name: "usageTerms",
    label: "Điều kiện sử dụng",
    type: "textarea",
    colSpan: 4,
    maxWords: 80,
  },
];

const defaultTicketInfoValues: DynamicFormValues = {
  cardCode: "TKT-2407-089",
  ticketType: "month",
  status: "active",
  ticketPackage: "Ô tô cư dân - tháng",
  price: "1.200.000đ",
  billingCycle: "Tháng 07/2026",
  owner: "Nguyễn Minh An",
  linkedVehicle: "51F-728.36",
  apartment: "---",
  issuedAt: "2026-07-01",
  expiredAt: "2026-07-31",
  usageTerms:
    "Vé chỉ dùng cho xe đã liên kết, quét QR hoặc RFID tại cổng B2/B3. Tự động khóa khi quá hạn thanh toán.",
};

export function MonthlyCardDetail({
  open,
  onClose,
  initialMode = "view",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: DynamicFormMode;
}) {
  const [ticketInfoValues, setTicketInfoValues] = useState<DynamicFormValues>(
    defaultTicketInfoValues,
  );
  const [formMode, setFormMode] = useState<DynamicFormMode>("view");

  useEffect(() => {
    if (open) setFormMode(initialMode);
  }, [initialMode, open]);

  const handleEdit = () => {
    setFormMode("edit");
    toastMessage.info("Đang chuyển sang chế độ sửa", "Bạn có thể cập nhật thông tin thẻ / vé.");
  };

  const handleSave = () => {
    setFormMode("view");
    toastMessage.success("Đã lưu thông tin thẻ / vé", String(ticketInfoValues.cardCode ?? ""));
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết thẻ / vé"
      description="Quản lý mã thẻ, gói vé, hiệu lực, lượt sử dụng và tài liệu phát hành liên quan."
      headerContent={<TicketSummary />}
      footer={
        <>
          <Button variant="danger-outline" size="lg">
            <Trash2 />
            Xóa thẻ
          </Button>
          {formMode === "view" ? (
            <Button variant="primary" size="lg" onClick={handleEdit}>
              <Edit3 />
              Sửa
            </Button>
          ) : (
            <Button variant="success-fill" size="lg" onClick={handleSave}>
              <Save />
              Lưu
            </Button>
          )}
          <Button variant="primary" size="lg">
            <Check />
            Xác nhận
          </Button>
          <Button variant="outline-plain" size="lg" onClick={onClose}>
            <X />
            Đóng
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <DynamicFormCard
          title="Thông tin thẻ / vé"
          fields={ticketInfoFields}
          values={ticketInfoValues}
          mode={formMode}
          columns={4}
          onValuesChange={setTicketInfoValues}
          action={
            <Button variant="secondary" size="sm">
              <RefreshCcw />
              Đồng bộ cổng
            </Button>
          }
          notice={{
            tone: "warning",
            content: "Vé sắp hết hạn trong 16 ngày. Cần xác nhận gia hạn hoặc hủy trước cuối kỳ.",
          }}
        />

        <DocumentUploadPanel />
      </div>
    </CommonDrawer>
  );
}

function TicketSummary() {
  return (
    <div className="grid min-w-0 gap-3 border-b border-[var(--sp-border)] bg-[var(--sp-surface)] p-4 sm:flex sm:items-center sm:gap-6">
      <div className="relative h-[94px] w-full min-w-0 overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,var(--color-brand-gradient-start),var(--color-brand-gradient-end))] p-4 text-white shadow-[var(--shadow-brand)] sm:h-[100px] sm:w-[226px] sm:shrink-0">
        <Ticket className="absolute right-4 top-4 size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2 [&>span:last-child]:shrink-0">
          <div className="mono min-w-0 flex-1 truncate text-lg font-medium text-[var(--sp-strong)] sm:text-xl">TKT-2407-089</div>
          <Badge variant="success">Vé tháng</Badge>
        </div>

        <div className="mt-3 grid min-w-0 grid-cols-3 gap-2 text-sm sm:mt-4 sm:gap-6 sm:text-base">
          <Meta label="Hiệu lực" value="01/07 - 31/07" />
          <Meta label="Khu vực" value="Bãi xe B2" />
          <Meta label="Thanh toán" value="Đã thu" />
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-xs font-regular text-[var(--sp-muted)] sm:text-sm">{label}</div>
      <div className="mt-1 min-w-0 truncate font-semibold leading-5 text-[var(--sp-strong)]">{value}</div>
    </div>
  );
}
