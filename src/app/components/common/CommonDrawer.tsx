import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";

const CommonDrawerOverlayContext =
  React.createContext<Dispatch<SetStateAction<ReactNode | null>> | null>(null);

export function useCommonDrawerOverlay(overlay: ReactNode | null) {
  const setOverlay = React.useContext(CommonDrawerOverlayContext);

  React.useEffect(() => {
    if (!setOverlay) return;

    setOverlay(overlay);
    return () => setOverlay(null);
  }, [overlay, setOverlay]);

  return Boolean(setOverlay);
}

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
  const [overlay, setOverlay] = React.useState<ReactNode | null>(null);

  if (!open) return null;

  return createPortal(
    <CommonDrawerOverlayContext.Provider value={setOverlay}>
      <div
        className="sp-drawer-overlay fixed inset-0 z-[100] flex justify-end bg-strong/40 backdrop-blur-[2px] transition-opacity [.dark_&]:bg-surface/30"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <section
          className={cn(
            "relative flex h-full w-full min-w-0 flex-col overflow-hidden bg-surface shadow-lg lg:w-[66.666vw]",
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
          {overlay}
        </section>
      </div>
    </CommonDrawerOverlayContext.Provider>,
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
    <header className="shrink-0 bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-3 sm:gap-6 sm:px-5 sm:py-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-strong sm:text-lg">{title}</h2>
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
    <main className="min-h-0 flex-1 overflow-y-auto bg-bg p-3 sm:p-4">
      {children}
    </main>
  );
}

export function CommonDrawerFooter({ children }: { children: ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border bg-surface px-4 py-3 sm:px-6 sm:py-4">
      {children}
    </footer>
  );
}
