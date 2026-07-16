import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { cardProfile } from "@/app/data";
import {
  Calendar,
  Check,
  CreditCard,
  RefreshCcw,
  Save,
  Ticket,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const detailFields = [
  { label: "Mã thẻ / vé *", value: "TKT-2407-089" },
  { label: "Loại vé *", value: "Vé tháng" },
  { label: "Trạng thái", value: "Còn hiệu lực" },
  { label: "Gói vé", value: "Ô tô cư dân - tháng" },
  { label: "Giá vé", value: "1.200.000đ" },
  { label: "Chu kỳ thanh toán", value: "Tháng 07/2026" },
  { label: "Chủ thẻ *", value: "Nguyễn Minh An", icon: UserRound },
  { label: "Liên kết xe", value: "51F-728.36" },
  { label: "Căn hộ", value: "---" },
  { label: "Ngày phát hành", value: "01/07/2026", icon: Calendar, wide: true },
  { label: "Ngày hết hạn", value: "31/07/2026", icon: Calendar, wide: true },
];

export function MonthlyCardDetail({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-[var(--sp-strong)]">Thông tin thẻ / vé</h3>
            <Button variant="secondary" size="sm">
              <RefreshCcw />
              Đồng bộ cổng
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {detailFields.map((field) => {
              const Icon = field.icon;
              return (
                <label
                  key={`${field.label}-${field.value}`}
                  className={field.wide ? "col-span-3 md:col-span-1" : ""}
                >
                  <span className="mb-2 block text-base font-regular text-[var(--sp-text)]">
                    {field.label}
                  </span>
                  <span className="flex h-11 items-center gap-3 rounded-[8px] border border-[var(--sp-border)] bg-[#F5F7FB] px-3 text-base font-medium text-[var(--sp-text)]">
                    {Icon ? <Icon className="size-4 text-[var(--sp-muted)]" /> : null}
                    {field.value}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="mb-2 text-base font-regular text-[var(--sp-text)]">
              Điều kiện sử dụng
            </div>
            <div className="rounded-lg border border-[var(--sp-border)] bg-[#F5F7FB] p-4 text-base leading-6 text-[var(--sp-text)]">
              Vé chỉ dùng cho xe đã liên kết, quét QR hoặc RFID tại cổng B2/B3. Tự động khóa
              khi quá hạn thanh toán.
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[#FFF4D8] px-4 py-3 text-base font-medium text-[#986A00]">
            Vé sắp hết hạn trong 16 ngày. Cần xác nhận gia hạn hoặc hủy trước cuối kỳ.
          </div>
        </Card>

        <Card className="sp-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--sp-strong)]">
              Tài liệu liên quan đến thẻ/vé
            </h3>
            <Button variant="outline" size="sm">
              <RefreshCcw />
              Đồng bộ
            </Button>
          </div>
          <div className="rounded-lg border border-dashed border-[#C9D3E4] bg-white p-5">
            <div className="flex items-center justify-center gap-1 text-base text-[var(--sp-muted)]">
              Drop files to attach, or{" "}
              <span className="font-bold text-[var(--sp-blue)]">browse.</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Attachment name="DanhSachNhanSu_Template.xlsx" meta="15/Jul/26 11:05 AM · 16 kB" />
              <Attachment name="moduleblue.png" meta="15/Jul/26 11:05 AM · 3.76 MB" />
            </div>
          </div>
        </Card>
      </div>
    </CommonDrawer>
  );
}

function TicketSummary() {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--sp-border)] bg-white p-4 sm:p-4">
      <div className="relative h-[100px] w-[226px] shrink-0 overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#25B7D7,#0B5CE6)] p-4 text-white shadow-[0_5px_30px_rgba(11,92,230,0.18)]">
        
        <Ticket className="absolute right-4 top-4 size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-[var(--sp-strong)]">TKT-2407-089</div>
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

function Attachment({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-[var(--sp-border)] bg-white p-4">
      <div className="grid size-10 place-items-center rounded-md bg-[var(--sp-blue-soft)] text-[var(--sp-blue)]">
        <CreditCard className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-base font-bold text-[var(--sp-blue)]">{name}</div>
        <div className="text-sm text-[var(--sp-muted)]">{meta}</div>
      </div>
    </div>
  );
}
