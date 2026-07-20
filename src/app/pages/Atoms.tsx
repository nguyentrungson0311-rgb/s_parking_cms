import { useState, type CSSProperties, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  MapPin,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { Topbar } from "@/app/components/layout/Topbar";
import { Badge } from "@/app/components/ui/badge";
import { Button, type ButtonProps } from "@/app/components/ui/button";
import { CalendarBox } from "@/app/components/ui/calendar";
import { Card } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { DropdownBox } from "@/app/components/ui/dropdownbox";
import {
  InputDate,
  InputField,
  InputSelect,
  SearchInput,
  TextAreaField,
  type DropdownOption,
} from "@/app/components/ui/input";
import { Progress } from "@/app/components/ui/progress";
import { StatusBadge, type StatusBadgeTone } from "@/app/components/ui/status-badge";
import {
  DataTable,
  TableCheckbox,
  TablePagination,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/app/components/ui/table";
import { cn } from "@/lib/utils";

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

const buttonVariants: Array<{
  variant: NonNullable<ButtonProps["variant"]>;
  label: string;
  icon?: ReactNode;
}> = [
  { variant: "primary", label: "Primary", icon: <Plus /> },
  { variant: "outline-primary", label: "Outline primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "outline-secondary", label: "Outline secondary" },
  { variant: "fill-secondary", label: "Fill secondary" },
  { variant: "success-fill", label: "Success fill", icon: <Save /> },
  { variant: "success-outline", label: "Success outline" },
  { variant: "danger", label: "Danger", icon: <Trash2 /> },
  { variant: "danger-fill", label: "Danger fill" },
  { variant: "danger-outline", label: "Danger outline" },
  { variant: "outline", label: "Outline", icon: <Download /> },
  { variant: "outline-plain", label: "Outline plain" },
  { variant: "plain", label: "Plain" },
  { variant: "ghost", label: "Ghost" },
  { variant: "disable", label: "Disable" },
];

const buttonSizes: Array<{
  size: NonNullable<ButtonProps["size"]>;
  label: string;
  icon?: ReactNode;
}> = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium", icon: <RefreshCw /> },
  { size: "lg", label: "Large", icon: <Save /> },
  { size: "icon-sm", label: "Icon sm", icon: <MoreVertical /> },
  { size: "icon", label: "Icon", icon: <Search /> },
  { size: "icon-lg", label: "Icon lg", icon: <CalendarDays /> },
];

type AtomCardId =
  | "badge"
  | "button"
  | "calendar"
  | "card"
  | "checkbox"
  | "dropdown"
  | "input"
  | "progress"
  | "status-badge"
  | "table";

const badgeVariants = ["success", "warning", "danger", "info", "neutral", "disabled"] as const;

const statusBadgeTones: StatusBadgeTone[] = [
  "green",
  "blue",
  "orange",
  "purple",
  "red",
  "grey",
  "yellow",
];

export function Atoms() {
  const [ticketType, setTicketType] = useState("month");
  const [status, setStatus] = useState("active");
  const [issuedAt, setIssuedAt] = useState("2026-07-01");
  const [expiredAt, setExpiredAt] = useState("2026-07-31");
  const [calendarValue, setCalendarValue] = useState("2026-07-20");
  const [dropdownValue, setDropdownValue] = useState("month");
  const [checked, setChecked] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<AtomCardId, boolean>>({
    badge: false,
    button: false,
    calendar: false,
    card: false,
    checkbox: false,
    dropdown: false,
    input: false,
    progress: false,
    "status-badge": false,
    table: false,
  });

  const toggleCard = (id: AtomCardId) => {
    setExpandedCards((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="sp-page">
      <Topbar title="UI components" breadcrumbs={["Home page", "UI", "UI components"]} />

      <div className="sp-page-scroll">
        <section
          className="sp-layout"
          style={{ "--sp-layout-template": "minmax(0, 1fr)" } as CSSProperties}
        >
          <div className="columns-1 gap-4 xl:columns-2">
            <AtomCard
              id="button"
              title="Button"
              description="Variants, sizes, icon button và trạng thái disabled."
              open={expandedCards.button}
              onToggle={toggleCard}
            >
              <div className="grid gap-6">
                <AtomGroup title="Variants">
                  <div className="flex flex-wrap gap-3">
                    {buttonVariants.map((item) => (
                      <Button
                        key={item.variant}
                        variant={item.variant}
                        size="md"
                        disabled={item.variant === "disable"}
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </AtomGroup>

                <AtomGroup title="Sizes">
                  <div className="flex flex-wrap items-center gap-3">
                    {buttonSizes.map((item) => (
                      <Button
                        key={item.size}
                        variant={item.size.startsWith("icon") ? "ghost" : "primary"}
                        size={item.size}
                        aria-label={item.label}
                      >
                        {item.icon}
                        {!item.size.startsWith("icon") ? item.label : null}
                      </Button>
                    ))}
                  </div>
                </AtomGroup>

                <AtomGroup title="Common actions">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="md">
                      <Download />
                      Xuất file
                    </Button>
                    <Button variant="outline-primary" size="md">
                      <RefreshCw />
                      Làm mới
                    </Button>
                    <Button variant="primary" size="md">
                      <Plus />
                      Thêm mới
                    </Button>
                    <Button variant="danger-outline" size="md">
                      <Trash2 />
                      Xóa
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="shadow-sm" aria-label="Mở menu">
                      <MoreVertical />
                    </Button>
                  </div>
                </AtomGroup>
              </div>
            </AtomCard>

            <AtomCard
              id="input"
              title="Input"
              description="Một component input gom text, select, date, search, textarea và disabled state."
              open={expandedCards.input}
              onToggle={toggleCard}
            >
              <div className="grid gap-6">
                <AtomGroup title="Default">
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
                    <InputField
                      label="Địa chỉ"
                      defaultValue="Tầng B2, Block A"
                      leftIcon={<MapPin className="size-4" />}
                    />
                  </div>
                </AtomGroup>

                <AtomGroup title="Date and search">
                  <div className="grid gap-5 lg:grid-cols-3">
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
                    <SearchInput className="h-10" placeholder="Tìm atom..." />
                  </div>
                </AtomGroup>

                <AtomGroup title="Textarea">
                  <div className="grid gap-5 lg:grid-cols-3">
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
                </AtomGroup>

                <AtomGroup title="Disabled">
                  <div className="grid gap-5 lg:grid-cols-3">
                    <InputField label="Input disabled" defaultValue="Không cho chỉnh sửa" disabled />
                    <InputSelect
                      label="Select disabled"
                      options={statusOptions}
                      defaultValue="active"
                      disabled
                    />
                    <InputDate label="Date disabled" defaultValue="2026-07-31" disabled />
                    <SearchInput className="h-10" placeholder="Search disabled" disabled />
                    <TextAreaField
                      label="Textarea disabled"
                      defaultValue="Nội dung chỉ đọc ở trạng thái disabled."
                      disabled
                      showCount
                      maxLength={120}
                    />
                  </div>
                </AtomGroup>
              </div>
            </AtomCard>

            <AtomCard
              id="badge"
              title="Badge"
              description="Badge trạng thái ngắn theo semantic variant."
              open={expandedCards.badge}
              onToggle={toggleCard}
            >
              <div className="flex flex-wrap gap-3">
                {badgeVariants.map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant}
                  </Badge>
                ))}
              </div>
            </AtomCard>

            <AtomCard
              id="status-badge"
              title="StatusBadge"
              description="Badge trạng thái có dot dùng trong table và dashboard."
              open={expandedCards["status-badge"]}
              onToggle={toggleCard}
            >
              <div className="flex flex-wrap gap-3">
                {statusBadgeTones.map((tone) => (
                  <StatusBadge key={tone} tone={tone}>
                    {tone}
                  </StatusBadge>
                ))}
              </div>
            </AtomCard>

            <AtomCard
              id="checkbox"
              title="Checkbox"
              description="Checkbox checked, unchecked, indeterminate và disabled."
              open={expandedCards.checkbox}
              onToggle={toggleCard}
            >
              <div className="grid gap-4">
                <label className="flex items-center gap-3 text-base font-medium text-[var(--sp-text)]">
                  <Checkbox checked={checked} onCheckedChange={setChecked} />
                  Checked controlled
                </label>
                <label className="flex items-center gap-3 text-base font-medium text-[var(--sp-text)]">
                  <Checkbox checked="indeterminate" />
                  Indeterminate
                </label>
                <label className="flex items-center gap-3 text-base font-medium text-[var(--sp-muted)]">
                  <Checkbox checked disabled />
                  Disabled
                </label>
              </div>
            </AtomCard>

            <AtomCard
              id="progress"
              title="Progress"
              description="Progress bar cho tỷ lệ hoàn thành và sức chứa."
              open={expandedCards.progress}
              onToggle={toggleCard}
            >
              <div className="grid gap-4">
                {[24, 58, 86].map((value) => (
                  <div key={value} className="grid gap-2">
                    <div className="flex items-center justify-between text-sm font-medium text-[var(--sp-muted)]">
                      <span>Progress {value}%</span>
                      <span>{value}%</span>
                    </div>
                    <Progress value={value} />
                  </div>
                ))}
              </div>
            </AtomCard>

            <AtomCard
              id="dropdown"
              title="DropdownBox"
              description="Popover option list dùng trong input select."
              open={expandedCards.dropdown}
              onToggle={toggleCard}
            >
              <div className="relative h-44 max-w-[360px]">
                <DropdownBox
                  className="!top-0"
                  options={ticketTypeOptions}
                  value={dropdownValue}
                  onSelect={setDropdownValue}
                />
              </div>
            </AtomCard>

            <AtomCard
              id="calendar"
              title="CalendarBox"
              description="Calendar popover dùng bởi InputDate."
              open={expandedCards.calendar}
              onToggle={toggleCard}
            >
              <div className="relative h-[340px] max-w-[320px]">
                <CalendarBox
                  className="!top-0"
                  value={calendarValue}
                  onSelect={setCalendarValue}
                />
              </div>
            </AtomCard>

            <AtomCard
              id="card"
              title="Card"
              description="Surface container chuẩn cho panel, section và repeated item."
              open={expandedCards.card}
              onToggle={toggleCard}
            >
              <Card className="p-4">
                <h3 className="text-base font-semibold text-[var(--sp-strong)]">Preview card</h3>
                <p className="mt-1 text-base text-[var(--sp-muted)]">
                  Nội dung nằm trong Card component với nền, radius và shadow của hệ thống.
                </p>
              </Card>
            </AtomCard>

            <AtomCard
              id="table"
              title="Table"
              description="DataTable, header/body/cell, checkbox và pagination."
              open={expandedCards.table}
              onToggle={toggleCard}
            >
              <div className="h-[280px]">
                <DataTable
                  minWidth={720}
                  footer={<TablePagination summary="1-3 of 24 results" />}
                >
                  <THead>
                    <TR>
                      <TH className="w-10 text-center">
                        <TableCheckbox checked />
                      </TH>
                      <TH className="w-[180px]">Mã thẻ</TH>
                      <TH className="w-[180px]">Chủ thẻ</TH>
                      <TH className="w-[140px]">Trạng thái</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {[
                      ["TKT-2407-089", "Nguyễn Minh An", "Còn hiệu lực"],
                      ["TKT-2407-112", "Trần Hoàng Nam", "Tạm khóa"],
                      ["TKT-2407-145", "Bùi Hải Yến", "Hết hạn"],
                    ].map(([cardCode, owner, rowStatus]) => (
                      <TR key={cardCode}>
                        <TD className="text-center">
                          <TableCheckbox />
                        </TD>
                        <TD className="font-medium">{cardCode}</TD>
                        <TD>{owner}</TD>
                        <TD>{rowStatus}</TD>
                      </TR>
                    ))}
                  </TBody>
                </DataTable>
              </div>
            </AtomCard>
          </div>
        </section>
      </div>
    </div>
  );
}

function AtomCard({
  id,
  title,
  description,
  open,
  onToggle,
  children,
}: {
  id: AtomCardId;
  title: string;
  description: string;
  open: boolean;
  onToggle: (id: AtomCardId) => void;
  children: ReactNode;
}) {
  return (
    <Card className="sp-card-borderless mb-4 inline-block w-full break-inside-avoid overflow-hidden">
      <div className="flex items-start justify-between gap-4 px-5 py-5">
        <div className="min-w-0">
          <h2 className="font-sf text-xl font-semibold text-[var(--sp-strong)]">{title}</h2>
          <p className="mt-1 text-base text-[var(--sp-muted)]">{description}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 shadow-sm"
          aria-label={open ? `Thu gọn ${title}` : `Mở rộng ${title}`}
          aria-expanded={open}
          onClick={() => onToggle(id)}
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </Button>
      </div>
      {open ? (
        <div className="border-t border-[var(--sp-border)] px-5 py-5">
          {children}
        </div>
      ) : null}
    </Card>
  );
}

function AtomGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <h3 className="text-base font-semibold text-[var(--sp-strong)]">{title}</h3>
      {children}
    </section>
  );
}
