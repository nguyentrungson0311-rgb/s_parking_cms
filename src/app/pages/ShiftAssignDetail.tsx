import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { StatusBadge } from "@/app/components/ui/status-badge";
import {
  DataTable,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/app/components/ui/table";
import type { ShiftAssign } from "@/app/types";
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

const SHIFT_DETAIL_IMAGES = {
  plate:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/White_BMW_car_seen_from_front.jpg",
  face:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
  overview:
    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80",
};

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
      title="Chi tiết ra /vào ca"
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
    <div className="border-b border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-[var(--sp-theme-soft)] text-[var(--sp-theme)]">
          <i className="bi bi-car-front-fill text-[22px] leading-none" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="mono truncate text-xl font-regular text-[var(--sp-strong)]">
              {item.ticketNumber}
            </h3>
            <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge>
          </div>
          <p className="mt-1 text-sm font-medium text-[var(--sp-muted)]">
            {item.lotCardNumber} · {item.vehicleName} · {item.plate}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      <div className="text-sm font-regular text-[var(--sp-muted)]">{label}</div>
      <div className="mt-1 text-base font-semibold text-[var(--sp-strong)]">{value}</div>
    </div>
  );
}

function BasicInfo({ item }: { item: ShiftAssign }) {
  return (
    <Card className="sp-card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <CheckSquare className="size-6 text-[var(--sp-theme)]" />
        <h3 className="text-lg font-semibold text-[var(--sp-strong)]">Thông tin cơ bản</h3>
      </div>
      <div className="px-4 pb-4">
        <BasicInfoTable item={item} />
      </div>
    </Card>
  );
}

function BasicInfoTable({ item }: { item: ShiftAssign }) {
  const hasExit = item.checkedOutAt !== "-";
  const exitTime = hasExit ? item.checkedOutAt : "--";
  const amount = item.payment === "-" ? "--" : item.payment;
  const duration = hasExit ? "2h 33m" : "--";


  return (
    <DataTable
      minWidth={1040}
      containerClassName="h-auto flex-none rounded-md"
      scrollClassName="max-h-none"
    >
      <THead className="static z-auto">
        <TR className="hover:bg-transparent">
          <TH className="w-[150px] border-r border-[var(--sp-border)] px-4">
            Hướng
          </TH>
          <TH className="w-[250px] border-r border-[var(--sp-border)] px-4">
            Thời gian
          </TH>
          <TH className="w-[140px] border-r border-[var(--sp-border)] px-4">
            Cổng
          </TH>
          <TH className="w-[140px] border-r border-[var(--sp-border)] px-4">
            Lần
          </TH>
          <TH className="w-[200px] border-r border-[var(--sp-border)] px-4">
            Tổng thời gian
          </TH>
          <TH className="w-[160px] px-4">Số tiền</TH>
        </TR>
      </THead>
      <TBody className="divide-y-0">
        <TR className="hover:bg-[var(--sp-table-row)]">
          <TD className="border-r border-[var(--sp-border)] px-4">
            <div className="flex items-center gap-3">
              <LogIn className="size-5 text-[var(--sp-green)]" />
              Vào
            </div>
          </TD>
          <TD className="border-r border-[var(--sp-border)] px-4">
            {item.checkedInAt}
          </TD>
          <TD className="border-r border-[var(--sp-border)] px-4">
            Cổng A
          </TD>
          <TD className="border-r border-[var(--sp-border)] px-4">
            Lần 02
          </TD>
          <TD className="border-r border-[var(--sp-border)] px-4">
            --
          </TD>
          <TD className="px-4">--</TD>
        </TR>
        <TR className="bg-[var(--sp-table-row-hover)] hover:bg-[var(--sp-table-row-hover)]">
          <TD className="border-r border-[var(--sp-border)] bg-[var(--sp-table-row-hover)] px-4">
            <div className="flex items-center gap-3">
              <LogOut className="size-5 text-[var(--sp-orange)]" />
              Ra
            </div>
          </TD>
          <TD className="border-r border-[var(--sp-border)] bg-[var(--sp-table-row-hover)] px-4">
            {exitTime}
          </TD>
          <TD className="border-r border-[var(--sp-border)] bg-[var(--sp-table-row-hover)] px-4">
            Cổng B
          </TD>
          <TD className="border-r border-[var(--sp-border)] bg-[var(--sp-table-row-hover)] px-4">
            Lần 04
          </TD>
          <TD className="border-r border-[var(--sp-border)] bg-[var(--sp-table-row-hover)] px-4">
            {duration}
          </TD>
          <TD className="bg-[var(--sp-table-row-hover)] px-4">
            {amount}
          </TD>
        </TR>
      </TBody>
    </DataTable>
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
  const hasImage = isIn || item.checkedOutAt !== "-";
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
          <h3 className="text-lg font-semibold text-[var(--sp-strong)]">{title}</h3>
        </div>
        {isIn ? <StatusBadge tone="green">Hợp lệ</StatusBadge> : null}
      </div>

      {!hasImage ? (
        <div className="grid min-h-[360px] place-items-center rounded-md border border-dashed border-[var(--sp-border)] bg-[var(--badge-neutral-bg)] p-6 text-center">
          <div className="max-w-[260px]">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--sp-theme-soft)] text-[var(--sp-theme)]">
              <LogOut className="size-7" />
            </div>
            <div className="mt-4 text-base font-extrabold text-[var(--sp-strong)]">
              Chưa có hình ảnh xe ra
            </div>
            <p className="mt-2 text-sm leading-5 text-[var(--sp-muted)]">
              Xe đang trong bãi, dữ liệu hình ảnh xe ra sẽ được cập nhật sau khi hoàn tất lượt ra.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 overflow-hidden rounded-md bg-[#164c8a] text-white">
            <BlueMeta label={isIn ? "Mã lượt vào" : "Mã lượt ra"} value={code} />
            <BlueMeta label="Camera" value="Cổng A / Lane 02" />
            <BlueMeta label="Kiểm tra" value="Không có cảnh báo" />
          </div>

          <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-[minmax(190px,0.82fr)_minmax(260px,1.55fr)]">
            <div className="grid h-full grid-rows-2 gap-3">
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

            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-[var(--sp-border)] bg-[var(--sp-surface)]">
              <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--sp-grey-soft)]">
                <img
                  src={SHIFT_DETAIL_IMAGES.overview}
                  alt={isIn ? "Ảnh tổng quan xe vào" : "Ảnh tổng quan xe ra"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="shrink-0 p-4">
                <div className="text-lg font-semibold text-[var(--sp-strong)]">Ảnh tổng quan</div>
                <div className="mt-1 text-md text-[var(--sp-muted)]">
                  Cổng B2 · {isIn ? item.checkedInAt : item.checkedOutAt} 
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

function BlueMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/25 px-4 py-3 last:border-r-0">
      <div className="text-sm font-regular text-white/75">{label}</div>
      <div className="mt-1 text-md font-medium">{value}</div>
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)]">
      <div className="relative h-[108px] shrink-0 overflow-hidden bg-[var(--sp-grey-soft)]">
        {isPlate ? (
          <img
            src={SHIFT_DETAIL_IMAGES.plate}
            alt="Ảnh biển số xe"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={SHIFT_DETAIL_IMAGES.face}
            alt="Ảnh khuôn mặt"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center p-2.5">
        <div className="flex items-center gap-2 text-sm font-medium leading-5 text-[var(--sp-strong)]">
          {isPlate ? (
            <ShieldCheck className="size-4 text-[var(--sp-purple)]" />
          ) : (
            <UserRound className="size-4 text-[var(--sp-purple)]" />
          )}
          {title}
        </div>
        <div className="mt-1 truncate text-md font-semibold leading-5 text-[var(--sp-strong)]">
          {value}
          
        </div>
        
      </div>
    </div>
  );
}
