import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  InputDate,
  InputField,
  InputSelect,
  type DropdownOption,
} from "@/app/components/ui/input";
import { cn } from "@/lib/utils";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

export type FilterPanelValue = string | boolean | string[];
export type FilterPanelValues = Record<string, FilterPanelValue>;

type FilterFieldBase = {
  name: string;
  label: string;
  className?: string;
  colSpan?: 1 | 2 | 3;
};

export type FilterPanelField =
  | (FilterFieldBase & {
      type: "select";
      options: DropdownOption[];
      placeholder?: string;
    })
  | (FilterFieldBase & {
      type: "text";
      placeholder?: string;
    })
  | (FilterFieldBase & {
      type: "date";
      placeholder?: string;
    })
  | (FilterFieldBase & {
      type: "date-range";
      fromName: string;
      toName: string;
      fromLabel?: string;
      toLabel?: string;
      fromPlaceholder?: string;
      toPlaceholder?: string;
    })
  | (FilterFieldBase & {
      type: "checkbox";
    })
  | (FilterFieldBase & {
      type: "checkbox-group";
      options: DropdownOption[];
    });

function getPopoverPosition(anchor: HTMLElement | null) {
  if (!anchor) return { top: 0, left: 16, width: 500 };

  const panelWidth = Math.min(500, window.innerWidth - 32);
  const anchorRect = anchor.getBoundingClientRect();
  const preferredLeft = anchorRect.right - panelWidth;
  const left = Math.min(Math.max(16, preferredLeft), window.innerWidth - panelWidth - 16);
  const top = Math.min(anchorRect.bottom + 10, window.innerHeight - 24);

  return { top, left, width: panelWidth };
}

export function FilterPanel({
  open,
  title = "Bộ lọc",
  fields,
  values = {},
  defaultValues = {},
  anchorRef,
  onApply,
  onReset,
  onClose,
}: {
  open: boolean;
  title?: string;
  fields: FilterPanelField[];
  values?: FilterPanelValues;
  defaultValues?: FilterPanelValues;
  anchorRef?: React.RefObject<HTMLElement>;
  onApply?: (values: FilterPanelValues) => void;
  onReset?: (values: FilterPanelValues) => void;
  onClose: () => void;
}) {
  const panelRef = React.useRef<HTMLElement>(null);
  const [draftValues, setDraftValues] = React.useState<FilterPanelValues>(values);
  const [position, setPosition] = React.useState({ top: 0, left: 16, width: 920 });

  const updatePosition = React.useCallback(() => {
    setPosition(getPopoverPosition(anchorRef?.current ?? null));
  }, [anchorRef]);

  React.useEffect(() => {
    if (!open) return;

    setDraftValues(values);
    updatePosition();
  }, [open, updatePosition, values]);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, onClose, open, updatePosition]);

  if (!open) return null;

  const setValue = (name: string, value: FilterPanelValue) => {
    setDraftValues((current) => ({ ...current, [name]: value }));
  };

  const toggleOption = (name: string, value: string) => {
    const currentValues = Array.isArray(draftValues[name]) ? (draftValues[name] as string[]) : [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setValue(name, nextValues);
  };

  const handleReset = () => {
    setDraftValues(defaultValues);
    onReset?.(defaultValues);
  };

  return (
    <section
      ref={panelRef}
      className="fixed z-50 max-h-[calc(100vh-100px)] overflow-visible rounded-[10px] border border-[var(--sp-border)] bg-white p-4 shadow-[0_18px_44px_rgba(18,32,51,0.16)]"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
      }}
      role="dialog"
      aria-label={title}
    >
      <header className="flex items-center justify-between gap-4 border-b border-[var(--sp-border)] pb-3">
        <h2 className="text-lg font-semibold leading-7 text-[var(--sp-strong)]">{title}</h2>
        <button
          type="button"
          className="grid size-8 place-items-center rounded-md text-[var(--sp-muted)] transition hover:bg-[var(--muted)] hover:text-[var(--sp-strong)]"
          onClick={onClose}
          aria-label="Đóng bộ lọc"
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="grid gap-x-3 gap-y-2 py-3 md:grid-cols-3">
        {fields.map((field) => {
          const fieldClassName = cn(
            field.colSpan === 2 && "md:col-span-2",
            field.colSpan === 3 && "md:col-span-3",
            field.className,
          );

          if (field.type === "select") {
            return (
              <InputSelect
                key={field.name}
                label={field.label}
                placeholder={field.placeholder ?? "Tất cả"}
                options={field.options}
                value={(draftValues[field.name] as string | undefined) ?? ""}
                onValueChange={(value) => setValue(field.name, value)}
                wrapperClassName={fieldClassName}
              />
            );
          }

          if (field.type === "date") {
            return (
              <InputDate
                key={field.name}
                label={field.label}
                placeholder={field.placeholder ?? "dd/mm/yyyy"}
                value={(draftValues[field.name] as string | undefined) ?? ""}
                onValueChange={(value) => setValue(field.name, value)}
                wrapperClassName={fieldClassName}
              />
            );
          }

          if (field.type === "date-range") {
            const checked = Boolean(draftValues[field.name]);

            return (
              <fieldset key={field.name} className={cn("min-w-0", fieldClassName)}>
                <label className="mb-2 flex min-h-9 items-center gap-2 text-base font-semibold text-[var(--sp-strong)]">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(nextChecked) => setValue(field.name, nextChecked)}
                    className="size-5 rounded-[6px]"
                  />
                  {field.label}
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <InputDate
                    label={field.fromLabel ?? "Từ ngày"}
                    placeholder={field.fromPlaceholder ?? "Tất cả"}
                    value={(draftValues[field.fromName] as string | undefined) ?? ""}
                    onValueChange={(value) => setValue(field.fromName, value)}
                    disabled={!checked}
                  />
                  <InputDate
                    label={field.toLabel ?? "Đến ngày"}
                    placeholder={field.toPlaceholder ?? "Tất cả"}
                    value={(draftValues[field.toName] as string | undefined) ?? ""}
                    onValueChange={(value) => setValue(field.toName, value)}
                    disabled={!checked}
                  />
                </div>
              </fieldset>
            );
          }

          if (field.type === "checkbox") {
            const checked = Boolean(draftValues[field.name]);

            return (
              <label
                key={field.name}
                className={cn(
                  "flex min-h-9 items-center gap-2 text-base font-semibold text-[var(--sp-strong)]",
                  fieldClassName,
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextChecked) => setValue(field.name, nextChecked)}
                  className="size-5 rounded-[6px]"
                />
                {field.label}
              </label>
            );
          }

          if (field.type === "checkbox-group") {
            const selectedValues = Array.isArray(draftValues[field.name])
              ? (draftValues[field.name] as string[])
              : [];

            return (
              <fieldset key={field.name} className={cn("min-w-0", fieldClassName)}>
                <legend className="mb-2 text-base font-semibold text-[var(--sp-strong)]">
                  {field.label}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((option) => {
                    const selected = selectedValues.includes(option.value);

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex min-h-9 items-center gap-2 rounded-[8px] px-2 text-base font-medium text-[var(--sp-strong)]",
                          selected && "bg-[var(--accent)]",
                        )}
                      >
                        <Checkbox
                          checked={selected}
                          onCheckedChange={() => toggleOption(field.name, option.value)}
                          className="size-5 rounded-[6px]"
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          }

          return (
            <InputField
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              value={(draftValues[field.name] as string | undefined) ?? ""}
              onChange={(event) => setValue(field.name, event.target.value)}
              wrapperClassName={fieldClassName}
              leftIcon={<Search className="size-4" />}
            />
          );
        })}
      </div>

      <footer className="flex justify-end gap-2 border-t border-[var(--sp-border)] pt-3">
        <Button variant="outline" size="md" onClick={handleReset}>
          <RotateCcw />
          Đặt lại
        </Button>
        <Button size="md" onClick={() => onApply?.(draftValues)}>
          <SlidersHorizontal />
          Áp dụng
        </Button>
        <Button variant="danger-outline" size="md" onClick={onClose}>
          <X />
          Đóng
        </Button>
      </footer>
    </section>
  );
}
