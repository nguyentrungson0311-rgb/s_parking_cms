import * as React from "react";
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { CalendarBox, formatDisplayDate, parseDisplayDate } from "@/app/components/ui/calendar";
import { DropdownBox, type DropdownOption } from "@/app/components/ui/dropdownbox";
import { cn } from "@/lib/utils";

export type { DropdownOption };
export { CalendarBox, DropdownBox };

const fieldShellClass =
  "sp-ui-control h-9 w-full rounded-[8px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 text-base font-medium text-[var(--sp-text)] outline-none transition placeholder:text-[var(--sp-subtle)] focus:border-[var(--sp-blue)] focus:bg-[var(--input-active)] disabled:cursor-not-allowed disabled:bg-[var(--sp-grey-soft)] disabled:text-[var(--sp-muted)]";
const activeFieldClass = "bg-[var(--input-active)]";

function hasFieldValue(value: unknown) {
  return value !== undefined && value !== null && value.toString().trim().length > 0;
}

function useInputActiveState({
  value,
  defaultValue,
}: {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
}) {
  const [hasValue, setHasValue] = React.useState(hasFieldValue(value ?? defaultValue));

  React.useEffect(() => {
    if (value !== undefined) setHasValue(hasFieldValue(value));
  }, [value]);

  return [hasValue, setHasValue] as const;
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
        "mb-2 block text-md font-medium text-[var(--sp-text)]",
        disabled && "text-[var(--sp-muted)]",
      )}
    >
      {label}
      {required && showRequiredMark ? <span className="ml-1 text-[var(--destructive)]">*</span> : null}
    </label>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldShellClass, className)} {...props} />;
}

export function SearchInput({
  className,
  inputClassName,
  disabled = false,
  value,
  defaultValue,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  inputClassName?: string;
}) {
  const [hasValue, setHasValue] = useInputActiveState({ value, defaultValue });

  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--sp-muted)]",
          disabled && "text-[var(--sp-subtle)]",
        )}
      />
      <Input
        type="search"
        className={cn(
          "h-full bg-[var(--sp-surface)] pl-10 font-normal",
          hasValue && !disabled && activeFieldClass,
          inputClassName,
        )}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setHasValue(hasFieldValue(event.target.value));
          onChange?.(event);
        }}
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
  value,
  defaultValue,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [hasValue, setHasValue] = useInputActiveState({ value, defaultValue });

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
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sp-muted)]",
              disabled && "text-[var(--sp-subtle)]",
            )}
          >
            {leftIcon}
          </span>
        ) : null}
        <Input
          id={inputId}
          required={required}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => {
            setHasValue(hasFieldValue(event.target.value));
            onChange?.(event);
          }}
          className={cn(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            hasValue && !disabled && activeFieldClass,
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <span
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sp-muted)]",
              disabled && "text-[var(--sp-subtle)]",
            )}
          >
            {rightIcon}
          </span>
        ) : null}
      </div>
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
  disabled = false,
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
  disabled?: boolean;
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
        onClick={() => {
          if (!disabled) setOpen((current) => !current);
        }}
        className={cn(
          fieldShellClass,
          "flex items-center justify-between gap-3 text-left",
          selectedOption && !disabled && activeFieldClass,
          !selectedOption && "text-[var(--sp-subtle)]",
        )}
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform",
            open && "rotate-180",
            disabled && "text-[var(--sp-subtle)]",
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
        />
      ) : null}
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
          value={currentValue ? formatDisplayDate(currentValue) : ""}
          placeholder={placeholder}
          inputMode="numeric"
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onChange={(event) => setCurrentValue(parseDisplayDate(event.target.value))}
          className={cn("pr-10", currentValue && !disabled && activeFieldClass)}
        />
        <button
          type="button"
          disabled={disabled}
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[var(--sp-muted)] hover:bg-[var(--sp-blue-soft)] hover:text-[var(--sp-blue)] disabled:cursor-not-allowed disabled:text-[var(--sp-subtle)]"
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
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  required?: boolean;
  showRequiredMark?: boolean;
  showCount?: boolean;
  maxWords?: number;
  wrapperClassName?: string;
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
        maxLength={maxWords ? undefined : maxLength}
        value={value !== undefined ? value : internalValue}
        onChange={(event) => {
          const nextValue = limitWords(event.target.value, maxWords);
          if (nextValue !== event.target.value) event.target.value = nextValue;
          if (value === undefined) setInternalValue(nextValue);
          onChange?.(event);
        }}
        className={cn(
          "sp-ui-control min-h-[112px] w-full resize-y rounded-[8px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 py-3 text-base font-medium leading-6 text-[var(--sp-text)] outline-none transition placeholder:text-[var(--sp-subtle)] focus:border-[var(--sp-blue)] focus:bg-[var(--input-active)] disabled:cursor-not-allowed disabled:bg-[var(--sp-grey-soft)] disabled:text-[var(--sp-muted)]",
          currentValue.trim().length > 0 && !disabled && activeFieldClass,
          className,
        )}
        {...props}
      />
      {showCount && maxCount ? (
        <div className="mt-1 text-right text-sm font-medium text-[var(--sp-muted)]">
          {currentCount}/{maxCount} {countLabel}
        </div>
      ) : null}
    </div>
  );
}
