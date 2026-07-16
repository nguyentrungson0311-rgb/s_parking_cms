import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export function CommonDrawer({
  open,
  title,
  description: _description,
  onClose,
  headerContent,
  footer,
  children,
  className,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  headerContent?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#111827]/20 backdrop-blur-[3px]">
      <section
        className={cn(
          "flex h-full w-full min-w-0 flex-col bg-white shadow-lg lg:w-[66.666vw]",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <CommonDrawerHeader title={title} onClose={onClose}>
          {headerContent}
        </CommonDrawerHeader>
        <CommonDrawerMain>{children}</CommonDrawerMain>
        {footer ? <CommonDrawerFooter>{footer}</CommonDrawerFooter> : null}
      </section>
    </div>,
    document.body,
  );
}

export function CommonDrawerHeader({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <header className="shrink-0 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--sp-border)] px-3 py-3 sm:gap-6 sm:px-3 sm:py-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[var(--sp-strong)] sm:text-xl">{title}</h2>
        </div>
        <Button variant="outline" size="icon" className="size-9 shrink-0" onClick={onClose}>
          <X />
        </Button>
      </div>
      {children ? <div>{children}</div> : null}
    </header>
  );
}

export function CommonDrawerMain({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[var(--sp-bg)] p-3 sm:p-4">
      {children}
    </main>
  );
}

export function CommonDrawerFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[var(--sp-border)] bg-white px-4 py-3 sm:px-6 sm:py-4">
      {children}
    </footer>
  );
}
