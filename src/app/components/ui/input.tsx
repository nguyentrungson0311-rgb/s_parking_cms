import * as React from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { CalendarBox, formatDisplayDate, parseDisplayDate } from "@/app/components/ui/calendar";
import { DropdownBox, type DropdownOption } from "@/app/components/ui/dropdownbox";
import { cn } from "@/lib/utils";

export type { DropdownOption };
export { CalendarBox, DropdownBox };

const fieldShellClass =
  "sp-ui-control h-9 w-full rounded-[8px] border border-border bg-surface px-3 text-base font-medium text-text outline-none transition placeholder:text-subtle enabled:hover:border-theme focus:border-theme disabled:cursor-not-allowed disabled:bg-grey-soft disabled:text-muted";
const fieldErrorClass =
  "border-destructive  enabled:hover:border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/10";

type FieldError = string | boolean;

function getInputPlaceholder(placeholder?: string, label?: string) {
  if (placeholder !== undefined) return placeholder;
  if (label?.trim()) return `Nhập ${label.trim().toLowerCase()}`;
  return "Nhập thông tin";
}

function useControllableValue({
  value,
  defaultValue = "",
  onValueChange,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [currentValue, setValue] as const;
}

function useCloseOnOutsideClick<T extends HTMLElement>(onClose: () => void) {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  return ref;
}

function FieldLabel({
  htmlFor,
  label,
  required,
  disabled,
  showRequiredMark = true,
}: {
  htmlFor?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  showRequiredMark?: boolean;
}) {
  if (!label) return null;

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 block text-md font-medium text-text",
        disabled && "text-muted",
      )}
    >
      {label}
      {required && showRequiredMark ? <span className="ml-1 text-destructive">*</span> : null}
    </label>
  );
}

function getErrorMessage(error?: FieldError) {
  if (!error) return "";
  return typeof error === "string" ? error : "Trường này là bắt buộc.";
}

function FieldErrorMessage({ error }: { error?: FieldError }) {
  const message = getErrorMessage(error);
  if (!message) return null;

  return <p className="mt-1 text-sm font-medium text-destructive">{message}</p>;
}

export function Input({
  className,
  error,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: FieldError;
}) {
  return (
    <input
      aria-invalid={Boolean(error) || props["aria-invalid"]}
      className={cn(fieldShellClass, error && fieldErrorClass, className)}
      placeholder={getInputPlaceholder(placeholder)}
      {...props}
    />
  );
}

export function SearchInput({
  className,
  inputClassName,
  disabled = false,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted",
          disabled && "text-subtle",
        )}
      />
      <Input
        type="search"
        className={cn(
          "h-full bg-surface pl-10 font-normal",
          inputClassName,
        )}
        disabled={disabled}
        placeholder={placeholder ?? "Tìm kiếm..."}
        {...props}
      />
    </div>
  );
}

export function InputField({
  label,
  required,
  showRequiredMark,
  wrapperClassName,
  leftIcon,
  rightIcon,
  className,
  id,
  disabled = false,
  error,
  placeholder,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: FieldError;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <FieldLabel
        htmlFor={inputId}
        label={label}
        required={required}
        disabled={disabled}
        showRequiredMark={showRequiredMark}
      />
      <div className="relative">
        {leftIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted",
              disabled && "text-subtle",
            )}
          >
            {leftIcon}
          </span>
        ) : null}
        <Input
          id={inputId}
          required={required}
          disabled={disabled}
          error={error}
          placeholder={getInputPlaceholder(placeholder, label)}
          className={cn(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted",
              disabled && "text-subtle",
            )}
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
      <FieldErrorMessage error={error} />
    </div>
  );
}

export function InputSelect({
  label,
  required,
  showRequiredMark,
  placeholder = "Chọn giá trị",
  options,
  value,
  defaultValue,
  onValueChange,
  wrapperClassName,
  triggerClassName,
  dropdownClassName,
  showSelectedIcon,
  disabled = false,
  error,
}: {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  wrapperClassName?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  showSelectedIcon?: boolean;
  disabled?: boolean;
  error?: FieldError;
}) {
  const generatedId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [currentValue, setCurrentValue] = useControllableValue({
    value,
    defaultValue,
    onValueChange,
  });
  const wrapperRef = useCloseOnOutsideClick<HTMLDivElement>(() => setOpen(false));
  const selectedOption = options.find((option) => option.value === currentValue);

  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div ref={wrapperRef} className={cn("relative min-w-0", wrapperClassName)}>
      <FieldLabel
        htmlFor={generatedId}
        label={label}
        required={required}
        disabled={disabled}
        showRequiredMark={showRequiredMark}
      />
      <button
        id={generatedId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        aria-invalid={Boolean(error)}
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        className={cn(
          fieldShellClass,
          "flex items-center justify-between gap-3 text-left",
          error && fieldErrorClass,
          !selectedOption && "text-subtle",
          triggerClassName,
        )}
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform",
            open && "rotate-180",
            disabled && "text-subtle",
          )}
        />
      </button>
      {open ? (
        <DropdownBox
          options={options}
          value={currentValue}
          onSelect={(nextValue) => {
            setCurrentValue(nextValue);
            setOpen(false);
          }}
          className={dropdownClassName}
          showSelectedIcon={showSelectedIcon}
        />
      ) : null}
      <FieldErrorMessage error={error} />
    </div>
  );
}

export function InputDate({
  label,
  required,
  showRequiredMark,
  value,
  defaultValue,
  onValueChange,
  placeholder = "dd/mm/yyyy",
  wrapperClassName,
  disabled = false,
  error,
}: {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  error?: FieldError;
}) {
  const generatedId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [currentValue, setCurrentValue] = useControllableValue({
    value,
    defaultValue,
    onValueChange,
  });
  const wrapperRef = useCloseOnOutsideClick<HTMLDivElement>(() => setOpen(false));

  React.useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div ref={wrapperRef} className={cn("relative min-w-0", wrapperClassName)}>
      <FieldLabel
        htmlFor={generatedId}
        label={label}
        required={required}
        disabled={disabled}
        showRequiredMark={showRequiredMark}
      />
      <div className="relative">
        <Input
          id={generatedId}
          required={required}
          disabled={disabled}
          error={error}
          value={currentValue ? formatDisplayDate(currentValue) : ""}
          placeholder={placeholder}
          inputMode="numeric"
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(event) => setCurrentValue(parseDisplayDate(event.target.value))}
          className="pr-10"
        />
        <button
          type="button"
          disabled={disabled}
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted disabled:cursor-not-allowed disabled:text-subtle"
          onClick={() => {
            if (!disabled) setOpen((current) => !current);
          }}
          aria-label="Mở lịch"
          aria-expanded={open}
        >
          <CalendarDays className="size-4" />
        </button>
      </div>
      {open && !disabled ? (
        <CalendarBox
          value={currentValue}
          onSelect={(nextValue) => {
            setCurrentValue(nextValue);
            setOpen(false);
          }}
        />
      ) : null}
      <FieldErrorMessage error={error} />
    </div>
  );
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function limitWords(value: string, maxWords?: number) {
  if (!maxWords) return value;
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= maxWords) return value;
  return parts.slice(0, maxWords).join(" ");
}

export function TextAreaField({
  label,
  required,
  showRequiredMark,
  showCount = false,
  maxWords,
  wrapperClassName,
  className,
  id,
  value,
  defaultValue,
  onChange,
  maxLength,
  disabled = false,
  error,
  placeholder,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  showCount?: boolean;
  maxWords?: number;
  wrapperClassName?: string;
  error?: FieldError;
}) {
  const generatedId = React.useId();
  const textareaId = id ?? generatedId;
  const [internalValue, setInternalValue] = React.useState(defaultValue?.toString() ?? "");
  const currentValue = value?.toString() ?? internalValue;
  const currentCount = maxWords ? countWords(currentValue) : currentValue.length;
  const maxCount = maxWords ?? maxLength;
  const countLabel = maxWords ? "từ" : "ký tự";

  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <FieldLabel
        htmlFor={textareaId}
        label={label}
        required={required}
        disabled={disabled}
        showRequiredMark={showRequiredMark}
      />
      <textarea
        id={textareaId}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        maxLength={maxWords ? undefined : maxLength}
        value={value !== undefined ? value : internalValue}
        placeholder={getInputPlaceholder(placeholder, label)}
        onChange={(event) => {
          const nextValue = limitWords(event.target.value, maxWords);
          if (nextValue !== event.target.value) event.target.value = nextValue;
          if (value === undefined) setInternalValue(nextValue);
          onChange?.(event);
        }}
        className={cn(
          "sp-ui-control min-h-[112px] w-full resize-y rounded-[8px] border border-border bg-surface px-3 py-3 text-base font-medium leading-6 text-text outline-none transition placeholder:text-subtle enabled:hover:border-theme focus:border-theme disabled:cursor-not-allowed disabled:bg-grey-soft disabled:text-muted",
          error && fieldErrorClass,
          className,
        )}
        {...props}
      />
      <FieldErrorMessage error={error} />
      {showCount && maxCount ? (
        <div className="mt-1 text-right text-sm font-medium text-muted">
          {currentCount}/{maxCount} {countLabel}
        </div>
      ) : null}
    </div>
  );
}
