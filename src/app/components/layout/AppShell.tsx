import type { PageId } from "@/app/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

const MobileMenuContext = createContext({
  openMobileMenu: () => {},
});

const NavigationContext = createContext({
  activePage: "dashboard" as PageId,
  navigate: (_page: PageId) => {},
});

type ThemeMode = "light" | "dark";
type BrandColor = "blue" | "green";

const ThemeContext = createContext({
  theme: "light" as ThemeMode,
  brand: "blue" as BrandColor,
  toggleTheme: () => {},
  setBrand: (_brand: BrandColor) => {},
});

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export function useAppNavigation() {
  return useContext(NavigationContext);
}

export function useTheme() {
  return useContext(ThemeContext);
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
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem("sp-theme") === "dark" ? "dark" : "light";
  });
  const [brand, setBrand] = useState<BrandColor>(() => {
    if (typeof window === "undefined") {
      return "blue";
    }

    return window.localStorage.getItem("sp-brand") === "green" ? "green" : "blue";
  });
  const mobileMenuContext = useMemo(
    () => ({
      openMobileMenu: () => setMobileMenuOpen(true),
    }),
    [],
  );
  const navigationContext = useMemo(
    () => ({
      activePage,
      navigate: onNavigate,
    }),
    [activePage, onNavigate],
  );
  const themeContext = useMemo(
    () => ({
      theme,
      brand,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      setBrand,
    }),
    [brand, theme],
  );

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("sp-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.brand = brand;
    window.localStorage.setItem("sp-brand", brand);
  }, [brand]);

  const handleMobileNavigate = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <MobileMenuContext.Provider value={mobileMenuContext}>
      <NavigationContext.Provider value={navigationContext}>
        <ThemeContext.Provider value={themeContext}>
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
        </ThemeContext.Provider>
      </NavigationContext.Provider>
    </MobileMenuContext.Provider>
  );
}
