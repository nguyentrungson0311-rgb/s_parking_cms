import * as React from "react";
import { CommonDrawer } from "@/app/components/common/CommonDrawer";
import { MainTableCard } from "@/app/components/common/MainTableCard";
import {  TableActionDropdown,  type TableActionDropdownItem,} from "@/app/components/common/TableActionDropdown";
import { Button } from "@/app/components/ui/button";
import {  DynamicForm,  type DynamicFormErrors,  type DynamicFormField,  type DynamicFormMode,  type DynamicFormValues,} from "@/app/components/ui/dynamic-form";
import { StatusBadge } from "@/app/components/ui/status-badge";
import {  DataTable,  TableCheckbox,  TablePagination,  TBody,  TD,  TH,  THead,  TR,  useTablePagination,} from "@/app/components/ui/table";
import { toastMessage } from "@/app/components/ui/toast";
import {  vehicleGroupRows,  type VehicleGroupSettingRow,} from "@/app/data/setting";
import { Edit3, Plus, Trash2 } from "lucide-react";

const vehicleTypeOptions = [
  { value: "Ô tô", label: "Ô tô" },
  { value: "Ô tô điện", label: "Ô tô điện" },
  { value: "Xe máy", label: "Xe máy" },
  { value: "Xe máy điện", label: "Xe máy điện" },
  { value: "Xe đạp", label: "Xe đạp" },
  { value: "Xe đạp điện", label: "Xe đạp điện" },
];

const statusOptions = [
  { value: "Đang sử dụng", label: "Đang sử dụng" },
  { value: "Chưa sử dụng", label: "Chưa sử dụng" },
  { value: "Ngừng sử dụng", label: "Ngừng sử dụng" },
];

const vehicleGroupFields: DynamicFormField[] = [
  {
    name: "name",
    label: "Tên nhóm xe",
    required: true,
    placeholder: "Nhập tên nhóm xe",
  },
  {
    name: "vehicleTypes",
    label: "Loại phương tiện",
    type: "multi-select" as const,
    required: true,
    placeholder: "Chọn một hoặc nhiều loại phương tiện",
    options: vehicleTypeOptions,
  },
  {
    name: "displayOrder",
    label: "Thứ tự hiển thị",
    type: "number",
    required: true,
    placeholder: "Nhập thứ tự hiển thị",
  },
  {
    name: "status",
    label: "Trạng thái",
    type: "select",
    required: true,
    placeholder: "Chọn trạng thái",
    options: statusOptions,
  },
];

type VehicleGroupFormState = {
  open: boolean;
  mode: DynamicFormMode;
  row?: VehicleGroupSettingRow;
  values: DynamicFormValues;
};

export function VehicleGroupDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [rows, setRows] = React.useState<VehicleGroupSettingRow[]>(vehicleGroupRows);
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [formState, setFormState] = React.useState<VehicleGroupFormState>({
    open: false,
    mode: "create",
    values: createEmptyValues(vehicleGroupRows.length + 1),
  });
  const [formErrors, setFormErrors] = React.useState<DynamicFormErrors>({});
  const pagination = useTablePagination({ data: rows, defaultPageSize: 10 });
  const visibleRows = pagination.paginatedData;
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id));
  const partiallySelected =
    visibleRows.some((row) => selectedRows.includes(row.id)) && !allSelected;

  const openForm = (mode: DynamicFormMode, row?: VehicleGroupSettingRow) => {
    setFormState({
      open: true,
      mode,
      row,
      values: row ? rowToValues(row) : createEmptyValues(rows.length + 1),
    });
    setFormErrors({});
  };

  const closeForm = () => {
    setFormState((current) => ({ ...current, open: false }));
    setFormErrors({});
  };

  const handleDelete = (row: VehicleGroupSettingRow) => {
    setRows((current) => current.filter((item) => item.id !== row.id));
    setSelectedRows((current) => current.filter((id) => id !== row.id));
    toastMessage.success("Đã xóa cấu hình nhóm xe", row.name);
  };

  const handleSubmit = () => {
    const nextErrors = getRequiredErrors(vehicleGroupFields, formState.values);
    const name = valueAsString(formState.values.name).trim();
    const vehicleTypes = valueAsArray(formState.values.vehicleTypes);
    const displayOrder = Number(valueAsString(formState.values.displayOrder));
    const status = valueAsString(formState.values.status);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      toastMessage.error("Không thể lưu", "Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (!Number.isFinite(displayOrder) || displayOrder <= 0) {
      setFormErrors({ displayOrder: "Thứ tự hiển thị phải lớn hơn 0." });
      toastMessage.error("Không thể lưu", "Thứ tự hiển thị phải lớn hơn 0.");
      return;
    }

    if (formState.mode === "create") {
      const nextRow: VehicleGroupSettingRow = {
        id: Math.max(0, ...rows.map((row) => row.id)) + 1,
        displayOrder,
        name,
        vehicleTypes,
        createdBy: "admin.cms",
        createdAt: formatTimestamp(new Date()),
        updatedBy: "admin.cms",
        updatedAt: formatTimestamp(new Date()),
        status,
      };

      setRows((current) => [...current, nextRow]);
      toastMessage.success("Đã thêm mới cấu hình nhóm xe", name);
      closeForm();
      return;
    }

    if (formState.row) {
      setRows((current) =>
        current.map((row) =>
          row.id === formState.row?.id
            ? {
                ...row,
                displayOrder,
                name,
                vehicleTypes,
                updatedBy: "admin.cms",
                updatedAt: formatTimestamp(new Date()),
                status,
              }
            : row,
        ),
      );
      toastMessage.success("Đã cập nhật cấu hình nhóm xe", name);
      closeForm();
    }
  };

  return (
    <>
      <CommonDrawer
        open={open}
        title="Cấu hình nhóm xe"
        onClose={onClose}
         >
        <MainTableCard
          title="Danh sách nhóm xe"
          actions={
            <Button size="md" onClick={() => openForm("create")}>
              <Plus />
              Thêm mới
            </Button>
          }
          className="h-full"
        >
          <DataTable
            minWidth={1180}
            footer={
              <TablePagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalItems={pagination.totalItems}
                onPageChange={pagination.setPage}
                onPageSizeChange={pagination.setPageSize}
              />
            }
          >
            <THead>
              <TR>
                <TH className="w-10 text-center">
                  <TableCheckbox
                    checked={allSelected}
                    indeterminate={partiallySelected}
                    onCheckedChange={(checked) => {
                      const visibleIds = visibleRows.map((row) => row.id);
                      setSelectedRows((current) =>
                        checked
                          ? Array.from(new Set([...current, ...visibleIds]))
                          : current.filter((id) => !visibleIds.includes(id)),
                      );
                    }}
                  />
                </TH>
                <TH className="w-[120px] text-center">Thứ tự hiển thị</TH>
                <TH className="w-[190px]">Tên nhóm xe</TH>
                <TH className="w-[320px]">Loại phương tiện</TH>
                <TH className="w-[140px]">Người tạo</TH>
                <TH className="w-[180px]">Ngày tạo</TH>
                <TH className="w-[150px]">Người cập nhật</TH>
                <TH className="w-[180px]">Ngày cập nhật</TH>
                <TH className="w-[140px]">Trạng thái</TH>
                <TH className="w-[56px] text-center" sticky="right" stickyOffset={0} stickyOnCompact />
              </TR>
            </THead>
            <TBody>
              {visibleRows.map((row) => {
                const selected = selectedRows.includes(row.id);
                const actions: TableActionDropdownItem[] = [
                  {
                    id: "edit",
                    label: "Sửa",
                    icon: <Edit3 className="size-4" />,
                    onSelect: () => openForm("edit", row),
                  },
                  {
                    id: "delete",
                    label: "Xóa",
                    icon: <Trash2 className="size-4" />,
                    tone: "danger",
                    onSelect: () => handleDelete(row),
                  },
                ];

                return (
                  <TR
                    key={row.id}
                    selected={selected}
                    onRowDetail={() => openForm("view", row)}
                    rowDetailLabel={`Xem cấu hình ${row.name}`}
                  >
                    <TD className="text-center" data-no-row-detail>
                      <TableCheckbox
                        checked={selected}
                        onCheckedChange={(checked) => {
                          setSelectedRows((current) =>
                            checked
                              ? [...current, row.id]
                              : current.filter((id) => id !== row.id),
                          );
                        }}
                      />
                    </TD>
                    <TD className="text-center">{row.displayOrder}</TD>
                    <TD className="font-medium text-strong">{row.name}</TD>
                    <TD>
                      <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                        {row.vehicleTypes.map((type) => (
                          <span
                            key={type}
                            className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border border-border bg-surface px-2 text-sm font-medium text-muted"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </TD>
                    <TD>{row.createdBy}</TD>
                    <TD>{row.createdAt}</TD>
                    <TD>{row.updatedBy}</TD>
                    <TD>{row.updatedAt}</TD>
                    <TD>
                      <StatusBadge tone={getStatusBadgeTone(row.status)}>{row.status}</StatusBadge>
                    </TD>
                    <TD className="text-center" sticky="right" stickyOffset={0} stickyOnCompact data-no-row-detail>
                      <TableActionDropdown
                        detailLabel="Xem"
                        onViewDetail={() => openForm("view", row)}
                        actions={actions}
                      />
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </DataTable>
        </MainTableCard>
      </CommonDrawer>

      <CommonDrawer
        open={formState.open}
        title={getFormTitle(formState.mode)}
        onClose={closeForm}
        
        footer={
          formState.mode === "view" ? (
            <>
              <Button variant="outline" size="md" onClick={closeForm}>
                Đóng
              </Button>
              <Button
                size="md"
                onClick={() => {
                  toastMessage.info("Đang chuyển sang chế độ sửa", formState.row?.name);
                  setFormState((current) => ({ ...current, mode: "edit" }));
                }}
              >
                <Edit3 />
                Sửa
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={closeForm}>
                Hủy
              </Button>
              <Button size="md" onClick={handleSubmit}>
                {formState.mode === "create" ? "Lưu" : "Cập nhật"}
              </Button>
            </>
          )
        }
      >
        <div className="rounded-md border border-border bg-surface p-4">
          <DynamicForm
            fields={vehicleGroupFields}
            values={formState.values}
            mode={formState.mode}
            columns={2}
            errors={formErrors}
            onValuesChange={(values) => {
              setFormState((current) => ({ ...current, values }));
              setFormErrors((current) => clearResolvedErrors(current, values));
            }}
          />
        </div>
      </CommonDrawer>
    </>
  );
}

function getFormTitle(mode: DynamicFormMode) {
  if (mode === "create") return "Thêm mới cấu hình nhóm xe";
  if (mode === "edit") return "Sửa cấu hình nhóm xe";
  return "Chi tiết cấu hình nhóm xe";
}

function createEmptyValues(displayOrder: number): DynamicFormValues {
  return {
    name: "",
    vehicleTypes: [],
    displayOrder: "",
    status: "",
  };
}

function rowToValues(row: VehicleGroupSettingRow): DynamicFormValues {
  return {
    name: row.name,
    vehicleTypes: row.vehicleTypes,
    displayOrder: String(row.displayOrder),
    status: row.status,
  };
}

function valueAsString(value: DynamicFormValues[string]) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function valueAsArray(value: DynamicFormValues[string]) {
  return Array.isArray(value) ? value : value ? [value] : [];
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

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + ` ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function getStatusBadgeTone(status: string) {
  if (status === "Đang sử dụng") return "green";
  if (status === "Chưa sử dụng") return "grey";
  return "red";
}
