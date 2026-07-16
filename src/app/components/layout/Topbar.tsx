import { SearchInput } from "@/app/components/ui/input";
import { Menu } from "lucide-react";
import { useMobileMenu } from "./AppShell";

export function Topbar({
  title,
  breadcrumbs = [],
}: {
  title: string;
  breadcrumbs?: string[];
}) {
  const { openMobileMenu } = useMobileMenu();

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
            <h1 className="sp-topbar-title whitespace-nowrap text-[20px] font-semibold text-[var(--sp-blue-strong)]">
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
              <div className="sp-topbar-breadcrumbs flex min-w-0 items-center gap-2 text-base text-[var(--sp-muted)]">
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
          <SearchInput className="sp-topbar-search h-9 w-[330px] rounded-lg" placeholder="Tìm kiếm..." />
          <button className="grid size-9 place-items-center text-[var(--sp-muted)] transition-colors hover:text-[var(--sp-blue)]" aria-label="Thông báo">
            <i className="bi bi-bell-fill text-[22px] leading-none" aria-hidden="true" />
          </button>
          <button className="grid size-9 place-items-center text-[var(--sp-muted)] transition-colors hover:text-[var(--sp-blue)]" aria-label="Cảnh báo">
            <i className="bi bi-info-circle-fill text-[22px] leading-none" aria-hidden="true" />
          </button>
          <div className="grid size-[42px] place-items-center rounded-full bg-[#DCE7F8] text-sm font-extrabold text-[#1F5B9D]">
            VN
          </div>
        </div>
      </header>
    </div>
  );
}
