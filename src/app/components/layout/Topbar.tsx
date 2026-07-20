import { useEffect, useRef, useState } from "react";
import { SearchInput } from "@/app/components/ui/input";
import { Check, Menu, Moon, Palette, Sun } from "lucide-react";
import { useAppNavigation, useMobileMenu, useTheme } from "./AppShell";
import { cn } from "@/lib/utils";

const brandOptions = [
  { value: "blue" as const, label: "Xanh dương", color: "#0b5ce6" },
  { value: "green" as const, label: "Xanh lá", color: "#009b5c" },
];

export function Topbar({
  title,
  breadcrumbs = [],
}: {
  title: string;
  breadcrumbs?: string[];
}) {
  const { openMobileMenu } = useMobileMenu();
  const { activePage, navigate } = useAppNavigation();
  const { brand, setBrand, theme, toggleTheme } = useTheme();
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const brandMenuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!brandMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!brandMenuRef.current?.contains(event.target as Node)) {
        setBrandMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBrandMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [brandMenuOpen]);

  return (
    <div className="sp-topbar-frame">
      <header className="sp-topbar">
        <div className="sp-topbar-heading flex min-w-0 items-center gap-6">
          <button
            type="button"
            className="sp-topbar-menu-button"
            aria-label="Open menu"
            onClick={openMobileMenu}
          >
            <Menu className="size-5" strokeWidth={2.2} />
          </button>
          <div className="sp-topbar-title-stack min-w-0">
            <h1 className="sp-topbar-title whitespace-nowrap text-[18px] font-semibold text-[var(--sp-theme-strong)]">
              {title}
            </h1>
            {breadcrumbs.length > 0 ? (
              <div className="sp-mobile-breadcrumbs">
                {breadcrumbs.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className={index === breadcrumbs.length - 1 ? "font-semibold text-[var(--sp-strong)]" : ""}
                  >
                    {index > 0 ? <span className="mx-2 text-[var(--sp-muted)]">›</span> : null}
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {breadcrumbs.length > 0 ? (
            <>
              <div className="sp-topbar-divider h-8 w-px bg-[var(--sp-border)]" />
              <div className="sp-topbar-breadcrumbs flex min-w-0 items-center gap-2 text-md text-[var(--sp-muted)]">
                {breadcrumbs.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className={
                      index === breadcrumbs.length - 1
                        ? "font-medium text-[var(--sp-strong)]"
                        : ""
                    }
                  >
                    {index > 0 ? (
                      <span className="mx-2 text-[var(--sp-muted)]">›</span>
                    ) : null}
                    {item}
                  </span>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="sp-topbar-actions flex shrink-0 items-center gap-[14px]">
          <div ref={brandMenuRef} className="relative">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-lg text-[var(--sp-muted)] transition-colors hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]"
              aria-label="Chọn màu thương hiệu"
              aria-expanded={brandMenuOpen}
              aria-haspopup="menu"
              title="Chọn màu thương hiệu"
              onClick={() => setBrandMenuOpen((current) => !current)}
            >
              <span className="relative grid size-[22px] place-items-center" aria-hidden="true">
                <Palette className="size-[22px]" strokeWidth={2.2} />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-[var(--sp-surface)] bg-[var(--sp-theme)]" />
              </span>
            </button>

            {brandMenuOpen ? (
              <div
                className="absolute right-0 top-[calc(100%+8px)] z-[90] w-44 rounded-[8px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-1 shadow-[var(--shadow-soft)]"
                role="menu"
              >
                {brandOptions.map((option) => {
                  const selected = option.value === brand;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className="flex h-9 w-full items-center gap-2 rounded-[7px] px-3 text-left text-base font-medium text-[var(--sp-text)] transition hover:bg-[var(--badge-neutral-bg)]"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => {
                        setBrand(option.value);
                        setBrandMenuOpen(false);
                      }}
                    >
                      <span
                        className="size-3.5 shrink-0 rounded-full"
                        style={{ backgroundColor: option.color }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      {selected ? <Check className="size-4 shrink-0 text-[var(--sp-theme)]" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg text-[var(--sp-muted)] transition-colors hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={isDark}
            title={isDark ? "Light theme" : "Dark theme"}
            onClick={toggleTheme}
          >
            {isDark ? (
              <Sun className="size-[22px]" strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <Moon className="size-[22px]" strokeWidth={2.2} aria-hidden="true" />
            )}
          </button>
          <SearchInput className="sp-topbar-search h-9 w-[330px] rounded-lg" placeholder="Tìm kiếm..." />
          <button className="grid size-9 place-items-center text-[var(--sp-muted)] transition-colors hover:text-[var(--sp-theme)]" aria-label="Thông báo">
            <i className="bi bi-bell-fill text-[22px] leading-none" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(
              "grid size-9 place-items-center rounded-lg text-[var(--sp-muted)] transition-colors hover:bg-[var(--sp-theme-soft)] hover:text-[var(--sp-theme)]",
              activePage === "ui-atoms" && "bg-[var(--sp-theme-soft)] text-[var(--sp-theme)]",
            )}
            aria-label="Atom components"
            title="Atom components"
            onClick={() => navigate("ui-atoms")}
          >
            <i className="bi bi-info-circle-fill text-[22px] leading-none" aria-hidden="true" />
          </button>
          <div className="grid size-[42px] place-items-center rounded-full bg-[var(--sp-theme-soft)] text-sm font-extrabold text-[var(--sp-theme)]">
            VN
          </div>
        </div>
      </header>
    </div>
  );
}
