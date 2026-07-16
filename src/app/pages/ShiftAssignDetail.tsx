import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { StatusBadge } from "@/app/components/ui/status-badge";
import type { ShiftAssign } from "@/app/types";
import type { ReactNode } from "react";
import {
  Check,
  CheckSquare,
  LogIn,
  LogOut,
  RefreshCcw,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

export function ShiftAssignDetail({
  open,
  item,
  onClose,
}: {
  open: boolean;
  item: ShiftAssign | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title="Chi tiết giao ca"
      headerContent={<ShiftSummary item={item} />}
      footer={
        <>
          <Button variant="secondary" size="lg">
            <RefreshCcw />
            Đồng bộ
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
      <div className="space-y-4">
        <BasicInfo item={item} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <VehicleImageCard title="Hình ảnh xe vào" direction="in" item={item} />
          <VehicleImageCard title="Hình ảnh xe ra" direction="out" item={item} />
        </div>
      </div>
    </CommonDrawer>
  );
}

function ShiftSummary({ item }: { item: ShiftAssign }) {
  const statusTone = item.status === "inYard" ? "orange" : "green";
  const statusLabel = item.status === "inYard" ? "Đang trong bãi" : "Đã ra";

  return (
    <div className="border-b border-[var(--sp-border)] bg-white px-3 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-[var(--sp-blue-soft)] text-[var(--sp-blue)]">
          <i className="bi bi-car-front-fill text-[22px] leading-none" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="mono truncate text-xl font-extrabold text-[var(--sp-strong)]">
              {item.ticketNumber}
            </h3>
            <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
          </div>
          <p className="mt-1 text-sm font-medium text-[var(--sp-muted)]">
            {item.lotCardNumber} · {item.vehicleName} · {item.plate}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <SummaryMeta label="Khách hàng" value={item.customer} />
        <SummaryMeta label="Mã căn" value={item.apartmentCode} />
        <SummaryMeta label="Ca vào" value={item.shiftIn} />
        <SummaryMeta label="Ca ra" value={item.shiftOut} />
      </div>
    </div>
  );
}

function SummaryMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold text-[var(--sp-muted)]">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-[var(--sp-strong)]">{value}</div>
    </div>
  );
}

function BasicInfo({ item }: { item: ShiftAssign }) {
  const exitTime = item.checkedOutAt === "-" ? "--" : item.checkedOutAt;
  const amount = item.payment === "-" ? "--" : item.payment;
  const duration = item.checkedOutAt === "-" ? "--" : "2h 33m";

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <CheckSquare className="size-6 text-[var(--sp-blue)]" />
        <h3 className="text-lg font-extrabold text-[var(--sp-strong)]">Thông tin cơ bản</h3>
      </div>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full min-w-[920px] border-separate border-spacing-0 overflow-hidden rounded-lg border border-[var(--sp-border)] text-left text-sm">
          <thead>
            <tr className="bg-[#F4F7FB] text-[var(--sp-muted)]">
              <InfoHead>Hướng</InfoHead>
              <InfoHead>Thời gian</InfoHead>
              <InfoHead>Cổng</InfoHead>
              <InfoHead>Lần</InfoHead>
              <InfoHead>Tổng thời gian</InfoHead>
              <InfoHead>Số tiền</InfoHead>
            </tr>
          </thead>
          <tbody>
            <InfoRow
              icon={<LogIn className="size-5 text-[var(--sp-green)]" />}
              direction="Vào"
              time={item.checkedInAt}
              gate="Cổng A"
              turn="Lần 02"
              duration="--"
              amount="--"
            />
            <InfoRow
              icon={<LogOut className="size-5 text-[var(--sp-orange)]" />}
              direction="Ra"
              time={exitTime}
              gate="Cổng B"
              turn="Lần 04"
              duration={duration}
              amount={amount}
              muted={item.checkedOutAt === "-"}
            />
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function InfoHead({ children }: { children: string }) {
  return (
    <th className="border-r border-[var(--sp-border)] px-4 py-3 font-extrabold last:border-r-0">
      {children}
    </th>
  );
}

function InfoRow({
  icon,
  direction,
  time,
  gate,
  turn,
  duration,
  amount,
  muted = false,
}: {
  icon: ReactNode;
  direction: string;
  time: string;
  gate: string;
  turn: string;
  duration: string;
  amount: string;
  muted?: boolean;
}) {
  const valueClass = muted ? "text-[var(--sp-muted)]" : "text-[var(--sp-strong)]";

  return (
    <tr className="odd:bg-white even:bg-[#F4F7FB]">
      <td className="border-r border-[var(--sp-border)] px-4 py-4 font-extrabold">
        <div className="flex items-center gap-3">
          {icon}
          {direction}
        </div>
      </td>
      <InfoCell className={valueClass}>{time}</InfoCell>
      <InfoCell className={valueClass}>{gate}</InfoCell>
      <InfoCell className={valueClass}>{turn}</InfoCell>
      <InfoCell className={valueClass}>{duration}</InfoCell>
      <InfoCell className={valueClass}>{amount}</InfoCell>
    </tr>
  );
}

function InfoCell({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <td className={`border-r border-[var(--sp-border)] px-4 py-4 font-extrabold last:border-r-0 ${className ?? ""}`}>
      {children}
    </td>
  );
}

function VehicleImageCard({
  title,
  direction,
  item,
}: {
  title: string;
  direction: "in" | "out";
  item: ShiftAssign;
}) {
  const isIn = direction === "in";
  const code = `${isIn ? "IN" : "OUT"}-${item.ticketNumber.replace("VS-", "")}`;

  return (
    <Card className="overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {isIn ? (
            <LogIn className="size-6 text-[var(--sp-orange)]" />
          ) : (
            <LogOut className="size-6 text-[var(--sp-orange)]" />
          )}
          <h3 className="text-lg font-extrabold text-[var(--sp-strong)]">{title}</h3>
        </div>
        {isIn ? <StatusBadge tone="green">Hợp lệ</StatusBadge> : null}
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-lg bg-[var(--sp-blue)] text-white">
        <BlueMeta label={isIn ? "Mã lượt vào" : "Mã lượt ra"} value={code} />
        <BlueMeta label="Camera" value="Cổng A / Lane 02" />
        <BlueMeta label="Kiểm tra" value="Không có cảnh báo" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(210px,0.95fr)_minmax(260px,1.55fr)]">
        <div className="grid gap-3">
          <EvidenceMiniCard
            type="plate"
            title="Biển số xe"
            value={item.plate === "-" ? "98A-468.27" : item.plate}
          />
          <EvidenceMiniCard
            type="face"
            title="Khuôn mặt"
            value={item.customer === "-" ? "Nguyễn Minh T." : item.customer}
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--sp-border)] bg-white">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#DCE3ED]">
            <div className="absolute inset-0 bg-[linear-gradient(150deg,#C8D1DA_0%,#EEF2F7_42%,#9BA8B8_43%,#D8DEE7_44%,#F7FAFD_100%)]" />
            <div className="absolute bottom-[18%] left-[8%] h-[44%] w-[76%] rounded-t-[42px] rounded-b-[16px] bg-[linear-gradient(160deg,#B8C3CF,#F7F9FC_52%,#8895A5)] shadow-[0_18px_30px_rgba(18,32,51,0.25)]" />
            <div className="absolute bottom-[13%] left-[20%] size-12 rounded-full bg-[#202A35] ring-8 ring-[#6D7885]" />
            <div className="absolute bottom-[13%] right-[16%] size-12 rounded-full bg-[#202A35] ring-8 ring-[#6D7885]" />
            <div className="absolute right-[12%] top-[12%] h-[70%] w-3 rotate-45 rounded-full bg-white shadow-md">
              <div className="mt-2 h-8 rounded-full bg-[#F05252]" />
            </div>
          </div>
          <div className="p-4">
            <div className="text-lg font-extrabold text-[var(--sp-strong)]">Ảnh tổng quan</div>
            <div className="mt-1 text-base text-[var(--sp-muted)]">
              Cổng B2 · {isIn ? item.checkedInAt : item.checkedOutAt} · {isIn ? "Lần vào 02" : "Lần ra 04"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BlueMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/25 px-4 py-3 last:border-r-0">
      <div className="text-xs text-white/75">{label}</div>
      <div className="mt-1 text-base font-extrabold">{value}</div>
    </div>
  );
}

function EvidenceMiniCard({
  type,
  title,
  value,
}: {
  type: "plate" | "face";
  title: string;
  value: string;
}) {
  const isPlate = type === "plate";

  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-lg border border-[var(--sp-border)] bg-white">
      <div
        className={
          isPlate
            ? "grid min-h-[118px] place-items-center bg-[#EEF2F7] p-3"
            : "relative min-h-[118px] overflow-hidden bg-[linear-gradient(160deg,#566579,#D7DFE8)]"
        }
      >
        {isPlate ? (
          <div className="rounded border-2 border-[#CDD6E2] bg-white px-2 py-3 text-center shadow-sm">
            <div className="text-[10px] font-bold text-[var(--sp-blue)]">VN</div>
            <div className="mono text-xl font-extrabold leading-tight text-[var(--sp-strong)]">
              98A
              <br />
              468.27
            </div>
          </div>
        ) : (
          <>
            <div className="absolute bottom-0 left-1/2 h-[78px] w-[82px] -translate-x-1/2 rounded-t-full bg-[#1F2937]" />
            <div className="absolute left-1/2 top-8 size-[54px] -translate-x-1/2 rounded-full bg-[#D5A27E]" />
          </>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center p-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--sp-strong)]">
          {isPlate ? (
            <ShieldCheck className="size-5 text-[var(--sp-purple)]" />
          ) : (
            <UserRound className="size-5 text-[var(--sp-purple)]" />
          )}
          {title}
        </div>
        <div className="mt-2 truncate text-sm font-extrabold text-[var(--sp-strong)]">
          {value}
          {!isPlate ? " - 96%" : null}
        </div>
        <div className="mt-1 text-sm text-[var(--sp-muted)]">18:42:11</div>
      </div>
    </div>
  );
}
