import * as React from "react";
import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { MainTableCard } from "@/app/components/common/MainTableCard";
import { MonthlyVehicleFeeTable } from "@/app/components/setting/MonthlyVehicleFeeTable";
import { Button } from "@/app/components/ui/button";
import {
  DynamicForm,
  DynamicFormCard,
  type DynamicFormErrors,
  type DynamicFormField,
  type DynamicFormMode,
  type DynamicFormValues,
} from "@/app/components/ui/dynamic-form";
import { toastMessage } from "@/app/components/ui/toast";
import {
  monthlyVehicleFeeRows,
  type MonthlyPricingRow,
  type MonthlyVehicleFeeRow,
} from "@/app/data/setting";
import { Edit3, Plus, Save } from "lucide-react";

type MonthlyPricingDrawerState = {
  open: boolean;
  mode: DynamicFormMode;
  row?: MonthlyPricingRow;
};

type VehicleFeeDrawerState = {
  open: boolean;
  mode: DynamicFormMode;
  row?: MonthlyVehicleFeeRow;
  values: DynamicFormValues;
};

const serviceOptions = [
  { value: "Cư dân", label: "Cư dân" },
  { value: "Cho thuê", label: "Cho thuê" },
  { value: "Dịch vụ", label: "Dịch vụ" },
];

const priceTypeOptions = [
  { value: "Cư dân", label: "Cư dân" },
  { value: "Cho thuê", label: "Cho thuê" },
  { value: "Dịch vụ", label: "Dịch vụ" },
];

const monthlyPolicyOptions = [
  {
    value: "Tính phí nửa tháng - Theo khoảng ngày",
    label: "Tính phí nửa tháng - Theo khoảng ngày",
  },
  { value: "Tính phí cả tháng", label: "Tính phí cả tháng" },
  { value: "Không hoàn phí", label: "Không hoàn phí" },
];

const statusOptions = [
  { value: "Đang sử dụng", label: "Đang sử dụng" },
  { value: "Chưa sử dụng", label: "Chưa sử dụng" },
  { value: "Ngừng sử dụng", label: "Ngừng sử dụng" },
];

const vehicleGroupOptions = [
  { value: "Xe máy", label: "Xe máy" },
  { value: "Ô tô", label: "Ô tô" },
  { value: "Xe đạp", label: "Xe đạp" },
  { value: "Xe đạp điện", label: "Xe đạp điện" },
];

const monthlyPricingFields: DynamicFormField[] = [
  {
    name: "service",
    label: "Loại dịch vụ",
    type: "select",
    required: true,
    placeholder: "Chọn loại dịch vụ",
    options: serviceOptions,
  },
  {
    name: "priceType",
    label: "Loại hình tính phí",
    type: "select",
    required: true,
    placeholder: "Chọn loại hình tính phí",
    options: priceTypeOptions,
  },
  {
    name: "effectiveDate",
    label: "Ngày hiệu lực",
    type: "date",
    required: true,
    placeholder: "Chọn ngày hiệu lực",
  },
  {
    name: "expiredDate",
    label: "Ngày hết hiệu lực",
    type: "date",
    placeholder: "Chọn ngày hết hiệu lực",
  },
  {
    name: "newRegistrationRule",
    label: "Đăng ký mới",
    type: "select",
    required: true,
    placeholder: "Chọn chính sách đăng ký mới",
    options: monthlyPolicyOptions,
  },
  {
    name: "newRegistrationThreshold",
    label: "Mốc thời gian",
    type: "number",
    required: true,
    placeholder: "Nhập mốc thời gian",
  },
  {
    name: "cancellationRule",
    label: "Hủy phương tiện",
    type: "select",
    required: true,
    placeholder: "Chọn chính sách hủy phương tiện",
    options: monthlyPolicyOptions,
  },
  {
    name: "cancellationThreshold",
    label: "Mốc thời gian",
    type: "number",
    required: true,
    placeholder: "Nhập mốc thời gian",
  },
  {
    name: "status",
    label: "Trạng thái",
    type: "select",
    required: true,
    placeholder: "Chọn trạng thái",
    options: statusOptions,
  },
  {
    name: "note",
    label: "Ghi chú",
    type: "text",
    colSpan: 4,
    placeholder: "--",
  },
];

const vehicleFeeFields: DynamicFormField[] = [
  {
    name: "vehicleGroup",
    label: "Nhóm xe",
    type: "select",
    required: true,
    placeholder: "Chọn nhóm xe",
    options: vehicleGroupOptions,
  },
  {
    name: "configName",
    label: "Tên cấu hình",
    required: true,
    placeholder: "Ví dụ: Ô tô thứ nhất",
  },
  {
    name: "fromVehicle",
    label: "Từ xe",
    type: "number",
    required: true,
    placeholder: "Nhập số xe",
  },
  {
    name: "toVehicle",
    label: "Đến xe",
    type: "number",
    required: true,
    placeholder: "Nhập số xe",
  },
  {
    name: "price",
    label: "Đơn giá",
    required: true,
    placeholder: "Nhập đơn giá",
    inputMode: "numeric",
  },
  {
    name: "displayOrder",
    label: "Thứ tự",
    type: "number",
    required: true,
    placeholder: "Nhập thứ tự",
  },
];

export function MonthlyPricingDrawer({
  state,
  rowsCount,
  onClose,
  onSave,
}: {
  state: MonthlyPricingDrawerState;
  rowsCount: number;
  onClose: () => void;
  onSave: (row: MonthlyPricingRow) => void;
}) {
  const [values, setValues] = React.useState<DynamicFormValues>(
    createEmptyMonthlyPricingValues(),
  );
  const [pricingErrors, setPricingErrors] = React.useState<DynamicFormErrors>({});
  const [vehicleFees, setVehicleFees] =
    React.useState<MonthlyVehicleFeeRow[]>(monthlyVehicleFeeRows);
  const [feeDrawer, setFeeDrawer] = React.useState<VehicleFeeDrawerState>({
    open: false,
    mode: "create",
    values: createEmptyVehicleFeeValues(monthlyVehicleFeeRows),
  });
  const [feeErrors, setFeeErrors] = React.useState<DynamicFormErrors>({});

  React.useEffect(() => {
    if (!state.open) return;
    setValues(
      state.row
        ? monthlyPricingToValues(state.row)
        : createEmptyMonthlyPricingValues(),
    );
    setPricingErrors({});
  }, [state.open, state.row]);

  const closeFeeDrawer = () => {
    setFeeDrawer((current) => ({ ...current, open: false }));
    setFeeErrors({});
  };

  const openFeeDrawer = (mode: DynamicFormMode, row?: MonthlyVehicleFeeRow) => {
    setFeeDrawer({
      open: true,
      mode,
      row,
      values: row ? vehicleFeeToValues(row) : createEmptyVehicleFeeValues(vehicleFees),
    });
    setFeeErrors({});
  };

  const handlePricingSubmit = () => {
    const nextErrors = getRequiredErrors(monthlyPricingFields, values);
    const service = valueAsString(values.service).trim();
    const priceType = valueAsString(values.priceType).trim();
    const effectiveDate = valueAsString(values.effectiveDate).trim();
    const newRegistrationRule = valueAsString(values.newRegistrationRule).trim();
    const newRegistrationThreshold = valueAsString(values.newRegistrationThreshold).trim();
    const cancellationRule = valueAsString(values.cancellationRule).trim();
    const cancellationThreshold = valueAsString(values.cancellationThreshold).trim();
    const status = valueAsString(values.status).trim();

    if (Object.keys(nextErrors).length > 0) {
      setPricingErrors(nextErrors);
      toastMessage.error("Không thể lưu", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    const nextRow: MonthlyPricingRow = {
      id: state.row?.id ?? rowsCount + 1,
      service,
      priceType,
      effectiveDate: toDisplayDate(effectiveDate),
      expiredDate: toDisplayDate(valueAsString(values.expiredDate)) || "--",
      createdBy: state.row?.createdBy ?? "admin.cms",
      createdAt: state.row?.createdAt ?? formatTimestamp(new Date()),
      updatedBy: "admin.cms",
      status,
      newRegistrationRule,
      newRegistrationThreshold,
      cancellationRule,
      cancellationThreshold,
      note: valueAsString(values.note).trim() || "--",
    };

    onSave(nextRow);
    toastMessage.success(
      state.mode === "create"
        ? "Đã thêm mới cài đặt gửi xe tháng"
        : "Đã cập nhật cài đặt gửi xe tháng",
      service,
    );
    onClose();
  };

  const handleVehicleFeeSubmit = () => {
    const nextErrors = getRequiredErrors(vehicleFeeFields, feeDrawer.values);
    const vehicleGroup = valueAsString(feeDrawer.values.vehicleGroup).trim();
    const configName = valueAsString(feeDrawer.values.configName).trim();
    const fromVehicle = Number(valueAsString(feeDrawer.values.fromVehicle));
    const toVehicle = Number(valueAsString(feeDrawer.values.toVehicle));
    const price = valueAsString(feeDrawer.values.price).trim();
    const displayOrder = Number(valueAsString(feeDrawer.values.displayOrder));

    if (Object.keys(nextErrors).length > 0) {
      setFeeErrors(nextErrors);
      toastMessage.error("Không thể lưu", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (
      !Number.isFinite(fromVehicle) ||
      !Number.isFinite(toVehicle) ||
      !Number.isFinite(displayOrder) ||
      fromVehicle <= 0 ||
      toVehicle < fromVehicle
    ) {
      setFeeErrors({
        fromVehicle: !Number.isFinite(fromVehicle) || fromVehicle <= 0,
        toVehicle: !Number.isFinite(toVehicle) || toVehicle < fromVehicle,
        displayOrder: !Number.isFinite(displayOrder),
      });
      toastMessage.error("Không thể lưu", "Khoảng số xe hoặc thứ tự chưa hợp lệ.");
      return;
    }

    const nextRow: MonthlyVehicleFeeRow = {
      id: feeDrawer.row?.id ?? Math.max(0, ...vehicleFees.map((row) => row.id)) + 1,
      displayOrder,
      vehicleGroup,
      configName,
      fromVehicle,
      toVehicle,
      price,
    };

    setVehicleFees((current) =>
      feeDrawer.mode === "create"
        ? [...current, nextRow]
        : current.map((row) => (row.id === nextRow.id ? nextRow : row)),
    );
    toastMessage.success(
      feeDrawer.mode === "create" ? "Đã thêm mới phí phương tiện" : "Đã cập nhật phí phương tiện",
      configName,
    );
    closeFeeDrawer();
  };

  return (
    <>
      <CommonDrawer
        open={state.open}
        title={getPricingDrawerTitle(state.mode)}
        onClose={onClose}
        footer={
          state.mode === "view" ? (
            <Button variant="outline" size="md" onClick={onClose}>
              Đóng
            </Button>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={onClose}>
                Hủy
              </Button>
              <Button size="md" onClick={handlePricingSubmit}>
                <Save />
                Lưu thông tin
              </Button>
            </>
          )
        }
      >
        <div
          className={
            state.mode === "view"
              ? "flex h-full min-h-0 flex-col gap-5 overflow-hidden"
              : "flex min-h-full flex-col gap-5"
          }
        >
          <DynamicFormCard
            title="Thông tin chung"
            fields={monthlyPricingFields}
            values={values}
            mode={state.mode}
            columns={4}
            errors={pricingErrors}
            onValuesChange={(nextValues) => {
              setValues(nextValues);
              setPricingErrors((current) => clearResolvedErrors(current, nextValues));
            }}
            className="shrink-0"
          />

          {state.mode === "view" ? (
            <MainTableCard
              title="Bảng phí từng loại phương tiện"
              showRefresh={false}
              titleClassName="text-lg font-bold leading-normal"
              actions={
                <Button
                  variant="outline-primary"
                  size="md"
                  onClick={() => openFeeDrawer("create")}
                >
                  <Plus />
                  Thêm mới
                </Button>
              }
              className="min-h-0 flex-1"
            >
              <MonthlyVehicleFeeTable
                rows={vehicleFees}
                onOpenDetail={(row) => openFeeDrawer("view", row)}
                onEdit={(row) => openFeeDrawer("edit", row)}
                onDelete={(row) => {
                  setVehicleFees((current) => current.filter((item) => item.id !== row.id));
                  toastMessage.success("Đã xóa phí phương tiện", row.configName);
                }}
              />
            </MainTableCard>
          ) : null}
        </div>
      </CommonDrawer>

      <CommonDrawer
        open={feeDrawer.open}
        title={getVehicleFeeDrawerTitle(feeDrawer.mode)}
        onClose={closeFeeDrawer}
        footer={
          feeDrawer.mode === "view" ? (
            <>
              <Button variant="outline" size="md" onClick={closeFeeDrawer}>
                Đóng
              </Button>
              <Button
                size="md"
                onClick={() => setFeeDrawer((current) => ({ ...current, mode: "edit" }))}
              >
                <Edit3 />
                Sửa
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={closeFeeDrawer}>
                Hủy bỏ
              </Button>
              <Button size="md" onClick={handleVehicleFeeSubmit}>
                <Save />
                Lưu thông tin
              </Button>
            </>
          )
        }
      >
        <div className="rounded-md border border-border bg-surface p-4">
          <DynamicForm
            fields={vehicleFeeFields}
            values={feeDrawer.values}
            mode={feeDrawer.mode}
            columns={4}
            errors={feeErrors}
            onValuesChange={(nextValues) => {
              setFeeDrawer((current) => ({ ...current, values: nextValues }));
              setFeeErrors((current) => clearResolvedErrors(current, nextValues));
            }}
          />
        </div>
      </CommonDrawer>
    </>
  );
}

function getPricingDrawerTitle(mode: DynamicFormMode) {
  if (mode === "create") return "Thêm mới cài đặt gửi xe tháng";
  if (mode === "edit") return "Sửa cài đặt gửi xe tháng";
  return "Xem chi tiết cài đặt gửi xe tháng";
}

function getVehicleFeeDrawerTitle(mode: DynamicFormMode) {
  if (mode === "create") return "Thêm mới phí phương tiện";
  if (mode === "edit") return "Sửa phí phương tiện";
  return "Xem chi tiết phí phương tiện";
}

function createEmptyMonthlyPricingValues(): DynamicFormValues {
  return {
    service: "",
    priceType: "",
    effectiveDate: "",
    expiredDate: "",
    newRegistrationRule: "",
    newRegistrationThreshold: "",
    cancellationRule: "",
    cancellationThreshold: "",
    status: "",
    note: "",
  };
}

function monthlyPricingToValues(row: MonthlyPricingRow): DynamicFormValues {
  return {
    service: row.service,
    priceType: row.priceType,
    effectiveDate: toIsoDate(row.effectiveDate),
    expiredDate: row.expiredDate === "--" ? "" : toIsoDate(row.expiredDate),
    newRegistrationRule: row.newRegistrationRule,
    newRegistrationThreshold: row.newRegistrationThreshold,
    cancellationRule: row.cancellationRule,
    cancellationThreshold: row.cancellationThreshold,
    status: row.status,
    note: row.note,
  };
}

function createEmptyVehicleFeeValues(rows: MonthlyVehicleFeeRow[]): DynamicFormValues {
  return {
    vehicleGroup: "",
    configName: "",
    fromVehicle: "",
    toVehicle: "",
    price: "",
    displayOrder: "",
  };
}

function vehicleFeeToValues(row: MonthlyVehicleFeeRow): DynamicFormValues {
  return {
    vehicleGroup: row.vehicleGroup,
    configName: row.configName,
    fromVehicle: String(row.fromVehicle),
    toVehicle: String(row.toVehicle),
    price: row.price,
    displayOrder: String(row.displayOrder),
  };
}

function valueAsString(value: DynamicFormValues[string]) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function getRequiredErrors(fields: DynamicFormField[], values: DynamicFormValues): DynamicFormErrors {
  return fields.reduce<DynamicFormErrors>((errors, field) => {
    if (!field.required) return errors;

    const value = values[field.name];
    const empty = Array.isArray(value) ? value.length === 0 : !value?.trim();
    if (empty) errors[field.name] = "Vui lòng nhập thông tin.";
    return errors;
  }, {});
}

function clearResolvedErrors(errors: DynamicFormErrors, values: DynamicFormValues): DynamicFormErrors {
  return Object.entries(errors).reduce<DynamicFormErrors>((nextErrors, [name, error]) => {
    const value = values[name];
    const empty = Array.isArray(value) ? value.length === 0 : !value?.trim();
    if (empty) nextErrors[name] = error;
    return nextErrors;
  }, {});
}

function toIsoDate(value: string) {
  const displayMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!displayMatch) return value;

  const [, day, month, year] = displayMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function toDisplayDate(value: string) {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!isoMatch) return value;

  const [, year, month, day] = isoMatch;
  return `${day}/${month}/${year}`;
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + ` ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}
