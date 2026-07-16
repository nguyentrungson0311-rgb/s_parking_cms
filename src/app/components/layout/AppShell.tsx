import type { PageId } from "@/app/types";
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

const MobileMenuContext = createContext({
  openMobileMenu: () => {},
});

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function AppShell({
  activePage,
  onNavigate,
  children,
}: {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuContext = useMemo(
    () => ({
      openMobileMenu: () => setMobileMenuOpen(true),
    }),
    [],
  );

  const handleMobileNavigate = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <MobileMenuContext.Provider value={mobileMenuContext}>
      <div className="sp-app">
        <div className="sp-shell" data-sidebar-collapsed={sidebarCollapsed ? "true" : undefined}>
          <div className="sp-sidebar-desktop">
            <Sidebar
              activePage={activePage}
              collapsed={sidebarCollapsed}
              onNavigate={onNavigate}
              onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
            />
          </div>

          <div
            className="sp-mobile-sidebar-layer"
            data-open={mobileMenuOpen ? "true" : undefined}
            aria-hidden={!mobileMenuOpen}
          >
            <button
              type="button"
              className="sp-mobile-sidebar-backdrop"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="sp-mobile-sidebar-panel">
              <Sidebar
                activePage={activePage}
                collapsed={false}
                onNavigate={handleMobileNavigate}
                onToggleCollapsed={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>

          <main className="sp-main">{children}</main>
        </div>
      </div>
    </MobileMenuContext.Provider>
  );
}
