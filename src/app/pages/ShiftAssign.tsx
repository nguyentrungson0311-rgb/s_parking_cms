import { useState } from "react";
import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import type { FilterPanelField } from "@/app/components/common/FilterPanel";
import { MainTableCard } from "@/app/components/common/MainTableCard";
import { Topbar } from "@/app/components/layout/Topbar";
import { Button } from "@/app/components/ui/button";
import {
  DynamicFormCard,
  type DynamicFormErrors,
  type DynamicFormField,
  type DynamicFormValues,
} from "@/app/components/ui/dynamic-form";
import {
  formatDisplayDate as formatIsoDisplayDate,
  isValidIsoDate,
  toIsoDate,
} from "@/app/components/ui/calendar";
import { toastMessage } from "@/app/components/ui/toast";
import { ShiftHandoverBatchTable } from "@/app/components/vehicles/ShiftHandoverBatchTable";
import { shiftAssigns } from "@/app/data/shiftassign";
import { shiftHandoverBatches } from "@/app/data/shifthandover";
import {
  matchesTableFilterValue,
  parseTableDate,
  useTableQuery,
} from "@/app/hooks/useTableQuery";
import { ShiftHandoverDetail } from "@/app/pages/ShiftHandoverDetail";
import type { ShiftHandoverBatch } from "@/app/types";
import { MoreVertical, Plus, Save } from "lucide-react";

const shiftHandoverFilterFields: FilterPanelField[] = [
  {
    type: "select",
    name: "shift",
    label: "Ca",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "shift1", label: "Ca 1" },
      { value: "shift2", label: "Ca 2" },
    ],
  },
  {
    type: "select",
    name: "status",
    label: "Trạng thái",
    options: [
      { value: "all", label: "Tất cả" },
      { value: "new", label: "Mới tạo" },
      { value: "profitCalculated", label: "Đã tính lợi nhuận" },
      { value: "reportPublished", label: "Đã phát hành báo cáo" },
      { value: "locked", label: "Đã khóa/Hoàn thành" },
    ],
  },
  {
    type: "date-range",
    name: "dateRange",
    label: "Ngày giao ca",
    fromName: "fromDate",
    toName: "toDate",
    fromLabel: "Từ ngày",
    toLabel: "Đến ngày",
    fromPlaceholder: "Tất cả",
    toPlaceholder: "Tất cả",
    colSpan: 3,
  },
];

const shiftHandoverDefaultFilters = {
  shift: "all",
  status: "all",
};

const shiftHandoverSearchFields: Array<keyof ShiftHandoverBatch> = [
  "code",
  "name",
  "shift",
  "date",
];

const shiftHandoverFields: DynamicFormField[] = [
  {
    name: "code",
    label: "Mã giao ca",
    required: true,
    placeholder: "Nhập mã giao ca",
  },
  {
    name: "name",
    label: "Tên đợt giao ca",
    required: true,
    placeholder: "Nhập tên đợt giao ca",
  },
  {
    name: "date",
    label: "Ngày giao ca",
    type: "date",
    required: true,
    placeholder: "Chọn ngày giao ca",
  },
  {
    name: "shift",
    label: "Ca",
    type: "radio",
    required: true,
    options: [
      { value: "Ca 1", label: "Ca 1" },
      { value: "Ca 2", label: "Ca 2" },
    ],
  },
  {
    name: "fromTime",
    label: "Từ giờ",
    required: true,
    inputType: "time",
  },
  {
    name: "toTime",
    label: "Đến giờ",
    required: true,
    inputType: "time",
  },
];

export function ShiftAssign() {
  const [rows, setRows] = useState<ShiftHandoverBatch[]>(shiftHandoverBatches);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ShiftHandoverBatch | null>(null);
  const [values, setValues] = useState<DynamicFormValues>(createEmptyValues());
  const [errors, setErrors] = useState<DynamicFormErrors>({});
  const query = useTableQuery({
    rows,
    defaultFilters: shiftHandoverDefaultFilters,
    searchFields: shiftHandoverSearchFields,
    filter: (row, filters) => {
      if (!matchesTableFilterValue(row.shift, filters.shift)) return false;
      if (!matchesTableFilterValue(row.status, filters.status)) return false;
      if (filters.dateRange) {
        const date = parseTableDate(row.date);
        const fromDate = parseTableDate(filters.fromDate);
        const toDate = parseTableDate(filters.toDate);
        if (fromDate && (!date || date < fromDate)) return false;
        if (toDate && (!date || date > toDate)) return false;
      }

      return true;
    },
  });

  const openCreateDrawer = () => {
    setValues(createEmptyValues());
    setErrors({});
    setDrawerOpen(true);
  };

  const closeCreateDrawer = () => {
    setDrawerOpen(false);
    setErrors({});
  };

  const handleSubmit = () => {
    const nextErrors = getRequiredErrors(shiftHandoverFields, values);
    const selectedDate = valueAsString(values.date);
    const fromTime = valueAsString(values.fromTime);
    const toTime = valueAsString(values.toTime);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toastMessage.error("Không thể lưu", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (!isValidIsoDate(selectedDate)) {
      setErrors({ date: "Ngày giao ca không hợp lệ." });
      toastMessage.error("Không thể lưu", "Ngày giao ca không hợp lệ.");
      return;
    }

    if (fromTime >= toTime) {
      setErrors({ toTime: "Đến giờ phải lớn hơn từ giờ." });
      toastMessage.error("Không thể lưu", "Đến giờ phải lớn hơn từ giờ.");
      return;
    }

    const now = new Date();
    const nextRow: ShiftHandoverBatch = {
      id: `handover-${Date.now()}`,
      code: valueAsString(values.code).trim(),
      name: valueAsString(values.name).trim(),
      shift: valueAsString(values.shift) as "Ca 1" | "Ca 2",
      date: formatIsoDisplayDate(selectedDate),
      fromTime,
      toTime,
      createdAt: formatTimestamp(now),
      updatedBy: "admin.cms",
      updatedAt: formatTimestamp(now),
      status: "new",
    };

    setRows((current) => [nextRow, ...current]);
    toastMessage.success("Đã thêm mới giao ca", nextRow.code);
    closeCreateDrawer();
  };

  return (
    <div className="sp-page">
      <Topbar
        title="Quản lý phương tiện"
        breadcrumbs={["Home page", "Quản lý phương tiện", "Giao ca"]}
      />

      <div className="sp-page-scroll sp-page-scroll-fill">
        <section className="sp-layout sp-layout-fill h-full min-h-0 min-w-0 overflow-hidden">
          {selectedBatch ? (
            <ShiftHandoverDetail
              batch={selectedBatch}
              shiftAssignRows={shiftAssigns}
              onBack={() => setSelectedBatch(null)}
            />
          ) : (
            <MainTableCard
              title="Danh sách giao ca"
              searchPlaceholder="Tìm mã giao ca, tên đợt giao ca..."
              searchValue={query.search}
              onSearchChange={query.setSearch}
              filterFields={shiftHandoverFilterFields}
              filterValues={query.filters}
              defaultFilterValues={shiftHandoverDefaultFilters}
              onFilterApply={query.setFilters}
              onFilterReset={query.resetFilters}
              actions={({ filterButton }) => (
                <>
                  {filterButton}
                  <Button size="md" onClick={openCreateDrawer}>
                    <Plus />
                    Thêm mới
                  </Button>
                  <Button variant="outline" size="icon-sm" className="size-9.5">
                    <MoreVertical />
                  </Button>
                </>
              )}
            >
              <ShiftHandoverBatchTable rows={query.filteredRows} onOpenDetail={setSelectedBatch} />
            </MainTableCard>
          )}
        </section>
      </div>

      <CommonDrawer
        open={drawerOpen}
        title="Thêm mới giao ca"
        onClose={closeCreateDrawer}
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeCreateDrawer}>
              Hủy
            </Button>
            <Button size="md" onClick={handleSubmit}>
              <Save />
              Lưu thông tin
            </Button>
          </>
        }
      >
        <DynamicFormCard
          title="Thông tin giao ca"
          fields={shiftHandoverFields}
          values={values}
          mode="create"
          columns={2}
          errors={errors}
          onValuesChange={(nextValues) => {
            setValues(nextValues);
            setErrors((current) => clearResolvedErrors(current, nextValues));
          }}
        />
      </CommonDrawer>
    </div>
  );
}

function createEmptyValues(): DynamicFormValues {
  return {
    code: "",
    name: "",
    date: toIsoDate(new Date()),
    shift: "Ca 1",
    fromTime: "",
    toTime: "",
  };
}

function valueAsString(value: DynamicFormValues[string]) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function getRequiredErrors(fields: DynamicFormField[], values: DynamicFormValues): DynamicFormErrors {
  return fields.reduce<DynamicFormErrors>((fieldErrors, field) => {
    if (!field.required) return fieldErrors;

    const value = values[field.name];
    const empty = Array.isArray(value) ? value.length === 0 : !value?.trim();
    if (empty) fieldErrors[field.name] = "Vui lòng nhập thông tin.";
    return fieldErrors;
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

function formatDisplayDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${formatDisplayDate(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
