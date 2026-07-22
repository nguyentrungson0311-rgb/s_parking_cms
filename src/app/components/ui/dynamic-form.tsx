import * as React from "react";
import { CheckIcon, ChevronDown } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import {
  InputDate,
  InputField,
  InputSelect,
  TextAreaField,
  type DropdownOption,
} from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

export type DynamicFormMode = "create" | "edit" | "view";

export type DynamicFormValue = string | string[];
export type DynamicFormValues = Record<string, DynamicFormValue>;
export type DynamicFormErrors = Record<string, string | boolean | undefined>;

export type DynamicFormField = {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "multi-select" | "radio" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: DropdownOption[];
  colSpan?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  wrapperClassName?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  showSelectedIcon?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  inputType?: React.HTMLInputTypeAttribute;
  leftIcon?: React.ReactNode;
  maxLength?: number;
  maxWords?: number;
};

const columnsClass: Record<1 | 2 | 3 | 4, string> = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

const colSpanClass: Record<1 | 2 | 3 | 4, string> = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
  4: "md:col-span-2 xl:col-span-4",
};

const noticeToneClass = {
  warning: "bg-[#FFF4D8] text-[#986A00]",
  info: "bg-theme-soft text-theme",
  success: "bg-badge-success-bg text-badge-success-fg",
  error: "bg-badge-danger-bg text-badge-danger-fg",
};

export type DynamicFormProps = {
  fields: DynamicFormField[];
  values: DynamicFormValues;
  mode?: DynamicFormMode;
  columns?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  className?: string;
  errors?: DynamicFormErrors;
  onValuesChange?: (values: DynamicFormValues) => void;
};

export type DynamicFormNotice = {
  tone?: keyof typeof noticeToneClass;
  content: React.ReactNode;
  className?: string;
};

function valueAsString(value: DynamicFormValue | undefined) {
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function valueAsArray(value: DynamicFormValue | undefined) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function DynamicForm({
  fields,
  values,
  mode = "edit",
  columns = 2,
  disabled = false,
  className,
  errors,
  onValuesChange,
}: DynamicFormProps) {
  const readonly = disabled || mode === "view";

  const setFieldValue = (name: string, value: DynamicFormValue) => {
    onValuesChange?.({
      ...values,
      [name]: value,
    });
  };

  return (
    <div className={cn("grid gap-4", columnsClass[columns], className)}>
      {fields.map((field) => {
        const fieldDisabled = readonly || field.disabled;
        const wrapperClassName = cn(colSpanClass[field.colSpan ?? 1], field.wrapperClassName);
        const error = errors?.[field.name];

        if (field.type === "select") {
          return (
            <InputSelect
              key={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              options={field.options ?? []}
              value={valueAsString(values[field.name])}
              onValueChange={(value) => setFieldValue(field.name, value)}
              wrapperClassName={wrapperClassName}
              triggerClassName={field.triggerClassName}
              dropdownClassName={field.dropdownClassName}
              showSelectedIcon={field.showSelectedIcon}
              disabled={fieldDisabled}
              error={error}
            />
          );
        }

        if (field.type === "multi-select") {
          return (
            <DynamicMultiSelect
              key={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              options={field.options ?? []}
              value={valueAsArray(values[field.name])}
              onValueChange={(value) => setFieldValue(field.name, value)}
              wrapperClassName={wrapperClassName}
              triggerClassName={field.triggerClassName}
              dropdownClassName={field.dropdownClassName}
              disabled={fieldDisabled}
              error={error}
            />
          );
        }

        if (field.type === "radio") {
          return (
            <DynamicRadioGroup
              key={field.name}
              label={field.label}
              required={field.required}
              options={field.options ?? []}
              value={valueAsString(values[field.name])}
              onValueChange={(value) => setFieldValue(field.name, value)}
              wrapperClassName={wrapperClassName}
              disabled={fieldDisabled}
              error={error}
            />
          );
        }

        if (field.type === "date") {
          return (
            <InputDate
              key={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              value={valueAsString(values[field.name])}
              onValueChange={(value) => setFieldValue(field.name, value)}
              wrapperClassName={wrapperClassName}
              disabled={fieldDisabled}
              error={error}
            />
          );
        }

        if (field.type === "textarea") {
          return (
            <TextAreaField
              key={field.name}
              label={field.label}
              required={field.required}
              placeholder={field.placeholder}
              value={valueAsString(values[field.name])}
              onChange={(event) => setFieldValue(field.name, event.target.value)}
              wrapperClassName={wrapperClassName}
              className={field.className}
              disabled={fieldDisabled}
              maxLength={field.maxLength}
              maxWords={field.maxWords}
              showCount={Boolean(field.maxLength || field.maxWords)}
              error={error}
            />
          );
        }

        return (
          <InputField
            key={field.name}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            type={field.inputType ?? (field.type === "number" ? "number" : "text")}
            inputMode={field.inputMode ?? (field.type === "number" ? "numeric" : undefined)}
            value={valueAsString(values[field.name])}
            onChange={(event) => setFieldValue(field.name, event.target.value)}
            wrapperClassName={wrapperClassName}
            className={field.className}
            disabled={fieldDisabled}
            leftIcon={field.leftIcon}
            error={error}
          />
        );
      })}
    </div>
  );
}

export function DynamicFormCard({
  title,
  action,
  notice,
  fields,
  values,
  mode = "edit",
  columns = 4,
  disabled = false,
  onValuesChange,
  errors,
  className,
  headerClassName,
  formClassName,
}: Omit<DynamicFormProps, "className"> & {
  title: string;
  action?: React.ReactNode;
  notice?: DynamicFormNotice;
  className?: string;
  headerClassName?: string;
  formClassName?: string;
}) {
  return (
    <Card className={cn("sp-card p-4", className)}>
      <div className={cn("mb-3 flex items-center justify-between gap-4", headerClassName)}>
        <h3 className="text-lg font-bold text-strong">{title}</h3>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <DynamicForm
        fields={fields}
        values={values}
        mode={mode}
        columns={columns}
        disabled={disabled}
        className={formClassName}
        errors={errors}
        onValuesChange={onValuesChange}
      />

      {notice ? (
        <div
          className={cn(
            "mt-4 rounded-md px-4 py-3 text-base font-medium",
            noticeToneClass[notice.tone ?? "info"],
            notice.className,
          )}
        >
          {notice.content}
        </div>
      ) : null}
    </Card>
  );
}

function DynamicMultiSelect({
  label,
  required,
  placeholder = "Chọn giá trị",
  options,
  value,
  onValueChange,
  wrapperClassName,
  triggerClassName,
  dropdownClassName,
  disabled,
  error,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  options: DropdownOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  wrapperClassName?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
  error?: string | boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const toggleValue = (nextValue: string) => {
    onValueChange(
      value.includes(nextValue)
        ? value.filter((item) => item !== nextValue)
        : [...value, nextValue],
    );
  };

  return (
    <div ref={wrapperRef} className={cn("relative min-w-0", wrapperClassName)}>
      <label className={cn("mb-2 block text-md font-medium text-text", disabled && "text-muted")}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        className={cn(
          "sp-ui-control flex h-9 w-full items-center justify-between gap-3 rounded-[8px] border border-border bg-surface px-3 text-left text-base font-medium text-text outline-none transition enabled:hover:border-theme focus:border-theme disabled:cursor-not-allowed disabled:bg-grey-soft disabled:text-muted",
          error && "border-destructive bg-badge-danger-bg/30 enabled:hover:border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/10",
          selectedLabels.length === 0 && "text-subtle",
          triggerClassName,
        )}
      >
        <span className="min-w-0 truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          className={cn(
            "sp-control-popover absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-[8px] border border-border bg-surface p-1 shadow-sp-soft",
            dropdownClassName,
          )}
          role="listbox"
        >
          {options.map((option) => {
            const checked = value.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                className="flex min-h-9 w-full items-center gap-2 rounded-[7px] px-3 text-left text-base font-medium text-text transition hover:bg-badge-neutral-bg disabled:cursor-not-allowed disabled:text-subtle"
                onClick={() => toggleValue(option.value)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-[5px] border border-border bg-surface text-primary-foreground",
                    checked && "border-theme bg-theme",
                  )}
                >
                  {checked ? <CheckIcon className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm font-medium text-destructive">
          {typeof error === "string" ? error : "Trường này là bắt buộc."}
        </p>
      ) : null}
    </div>
  );
}

function DynamicRadioGroup({
  label,
  required,
  options,
  value,
  onValueChange,
  wrapperClassName,
  disabled,
  error,
}: {
  label: string;
  required?: boolean;
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  wrapperClassName?: string;
  disabled?: boolean;
  error?: string | boolean;
}) {
  return (
    <fieldset className={cn("min-w-0", wrapperClassName)} aria-invalid={Boolean(error)}>
      <legend className={cn("mb-2 block text-md font-medium text-text", disabled && "text-muted")}>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </legend>
      <div className="flex min-h-9 flex-wrap items-center gap-4">
        {options.map((option) => {
          const checked = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-[8px] border border-border bg-surface px-3 text-base font-medium text-text transition hover:border-theme",
                checked && "border-theme bg-theme-soft text-theme",
                disabled && "cursor-not-allowed bg-grey-soft text-muted",
                error && "border-destructive bg-badge-danger-bg/30",
              )}
            >
              <span
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-full border border-border bg-surface",
                  checked && "border-theme",
                )}
                aria-hidden="true"
              >
                {checked ? <span className="size-2 rounded-full bg-theme" /> : null}
              </span>
              <input
                type="radio"
                className="sr-only"
                disabled={disabled || option.disabled}
                checked={checked}
                value={option.value}
                onChange={() => onValueChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="mt-1 text-sm font-medium text-destructive">
          {typeof error === "string" ? error : "Trường này là bắt buộc."}
        </p>
      ) : null}
    </fieldset>
  );
}
