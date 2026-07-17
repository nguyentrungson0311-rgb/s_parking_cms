import { useState, type CSSProperties } from "react";
import { MapPin, UserRound } from "lucide-react";
import { Topbar } from "@/app/components/layout/Topbar";
import { Card } from "@/app/components/ui/card";
import {
  InputDate,
  InputField,
  InputSelect,
  SearchInput,
  TextAreaField,
  type DropdownOption,
} from "@/app/components/ui/input";

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

export function Atoms() {
  const [ticketType, setTicketType] = useState("month");
  const [status, setStatus] = useState("active");
  const [issuedAt, setIssuedAt] = useState("2026-07-01");
  const [expiredAt, setExpiredAt] = useState("2026-07-31");

  return (
    <div className="sp-page">
      <Topbar title="Atom components" breadcrumbs={["Home page", "UI", "Atom components"]} />

      <div className="sp-page-scroll">
        <section
          className="sp-layout"
          style={{ "--sp-layout-template": "minmax(0, 1fr)" } as CSSProperties}
        >
          <Card className="sp-card-borderless p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-sf text-xl font-semibold text-[var(--sp-strong)]">
                  Input atoms
                </h2>
                <p className="mt-1 text-base text-[var(--sp-muted)]">
                  Các control dùng style nội bộ, không dùng native select/date của trình duyệt.
                </p>
              </div>
              <SearchInput className="h-10 w-full max-w-[360px]" placeholder="Tìm atom..." />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
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
              <InputField
                label="Địa chỉ"
                defaultValue="Tầng B2, Block A"
                leftIcon={<MapPin className="size-4" />}
              />

              <TextAreaField
                wrapperClassName="lg:col-span-2"
                label="Ghi chú"
                required
                placeholder="Nhập ghi chú dài..."
                maxWords={60}
                showCount
                defaultValue="Cho phép nhập đoạn văn dài và bật bộ đếm khi cần giới hạn số chữ."
              />
              <TextAreaField
                label="Mô tả không bắt buộc"
                placeholder="Bộ đếm đang ẩn"
                maxLength={160}
              />
            </div>

            <div className="my-6 h-px bg-[var(--sp-border)]" />

            <div className="mb-5">
              <h2 className="font-sf text-xl font-semibold text-[var(--sp-strong)]">
                Disabled
              </h2>
              <p className="mt-1 text-base text-[var(--sp-muted)]">
                Các trạng thái mặc định và không cho thao tác của input atom.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <InputField label="Input disabled" defaultValue="Không cho chỉnh sửa" disabled />
              <InputSelect
                label="Select disabled"
                options={statusOptions}
                defaultValue="active"
                disabled
              />
              <InputDate label="Date disabled" defaultValue="2026-07-31" disabled />

              <SearchInput
                className="h-10"
                placeholder="Search default"
              />
              <SearchInput
                className="h-10"
                placeholder="Search disabled"
                disabled
              />
              <TextAreaField
                label="Textarea disabled"
                defaultValue="Nội dung chỉ đọc ở trạng thái disabled."
                disabled
                showCount
                maxLength={120}
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
