import { useState } from "react";
import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { DocumentUploadPanel } from "@/app/components/common/DocumentUploadPanel";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  InputDate,
  InputField,
  InputSelect,
  TextAreaField,
  type DropdownOption,
} from "@/app/components/ui/input";
import {
  Check,
  RefreshCcw,
  Save,
  Ticket,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const ticketTypeOptions: DropdownOption[] = [
  { value: "month", label: "Vé tháng" },
  { value: "day", label: "Vé ngày" },
  { value: "outside", label: "Vé ngoài" },
];

const statusOptions: DropdownOption[] = [
  { value: "active", label: "Còn hiệu lực" },
  { value: "locked", label: "Tạm khóa" },
  { value: "expired", label: "Hết hạn" },
];

export function MonthlyCardDetail({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [ticketType, setTicketType] = useState("month");
  const [status, setStatus] = useState("active");
  const [issuedAt, setIssuedAt] = useState("2026-07-01");
  const [expiredAt, setExpiredAt] = useState("2026-07-31");

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
          <Button variant="success-fill" size="lg">
            <Save />
            Lưu
          </Button>
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
        <Card className="sp-card p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[var(--sp-strong)]">Thông tin thẻ / vé</h3>
            <Button variant="secondary" size="sm">
              <RefreshCcw />
              Đồng bộ cổng
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InputField label="Mã thẻ / vé" required defaultValue="TKT-2407-089" />
            <InputSelect
              label="Loại vé"
              required
              options={ticketTypeOptions}
              value={ticketType}
              onValueChange={setTicketType}
            />
            <InputSelect
              label="Trạng thái"
              options={statusOptions}
              value={status}
              onValueChange={setStatus}
            />

            <InputField label="Gói vé" defaultValue="Ô tô cư dân - tháng" />
            <InputField label="Giá vé" type="text" inputMode="numeric" defaultValue="1.200.000đ" />
            <InputField label="Chu kỳ thanh toán" defaultValue="Tháng 07/2026" />

            <InputField
              label="Chủ thẻ"
              required
              defaultValue="Nguyễn Minh An"
              leftIcon={<UserRound className="size-4" />}
            />
            <InputField label="Liên kết xe" defaultValue="51F-728.36" />
            <InputField label="Căn hộ" defaultValue="---" />

            <InputDate
              label="Ngày phát hành"
              value={issuedAt}
              onValueChange={setIssuedAt}
            />
            <InputDate
              label="Ngày hết hạn"
              required
              value={expiredAt}
              onValueChange={setExpiredAt}
            />
          </div>

          <TextAreaField
            wrapperClassName="mt-4"
            label="Điều kiện sử dụng"
            defaultValue="Vé chỉ dùng cho xe đã liên kết, quét QR hoặc RFID tại cổng B2/B3. Tự động khóa khi quá hạn thanh toán."
            maxWords={80}
            
          />

          <div className="mt-4 rounded-md bg-[#FFF4D8] px-4 py-3 text-base font-medium text-[#986A00]">
            Vé sắp hết hạn trong 16 ngày. Cần xác nhận gia hạn hoặc hủy trước cuối kỳ.
          </div>
        </Card>

        <DocumentUploadPanel />
      </div>
    </CommonDrawer>
  );
}

function TicketSummary() {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--sp-border)] bg-[var(--sp-surface)] p-4 sm:p-4">
      <div className="relative h-[100px] w-[226px] shrink-0 overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,var(--color-brand-gradient-start),var(--color-brand-gradient-end))] p-4 text-white shadow-[var(--shadow-brand)]">
        <Ticket className="absolute right-4 top-4 size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className="mono truncate text-xl font-medium text-[var(--sp-strong)]">TKT-2407-089</div>
          <Badge variant="success">Vé tháng</Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-6 text-base">
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
    <div>
      <div className="text-sm font-regular text-[var(--sp-muted)]">{label}</div>
      <div className="mt-1 font-semibold text-[var(--sp-strong)]">{value}</div>
    </div>
  );
}
