import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight } from "lucide-react";

export interface TabDefinition<T extends string = string> {
  id: T;
  label: string;
  shortLabel?: string;
  description?: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: "primary" | "cyan" | "emerald" | "amber" | "rose";
}

interface SidebarTabsProps<T extends string = string> {
  tabs: TabDefinition<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  layout?: "horizontal" | "vertical" | "adaptive";
  mobileTitle?: string;
  className?: string;
  storageKey?: string;
}

export function SidebarTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  layout = "adaptive",
  mobileTitle = "Navigation",
  className = "",
  storageKey,
}: SidebarTabsProps<T>) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tabId: T) => {
    onTabChange(tabId);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, tabId);
      } catch (e) {
        // Ignore localStorage quota errors
      }
    }
    setMobileDrawerOpen(false);
  };

  // Scroll active tab pill into view on mobile quick-scroll bar
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeTabRef.current;
      const scrollLeft = element.offsetLeft - container.offsetWidth / 2 + element.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
    }
  }, [activeTab]);

  const getBadgeClass = (color?: string, isActive?: boolean) => {
    if (isActive) {
      return "bg-white/25 text-white";
    }
    switch (color) {
      case "amber":
        return "bg-amber-500/15 text-amber-500 dark:text-amber-400";
      case "emerald":
        return "bg-[#20E3A2]/15 text-[#20E3A2]";
      case "rose":
        return "bg-rose-500/15 text-rose-500 dark:text-rose-400";
      case "cyan":
        return "bg-[#00D9FF]/15 text-[#00D9FF]";
      case "primary":
      default:
        return "bg-[#6D5DFC]/15 text-[#6D5DFC] dark:text-[#a399ff]";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Mobile Bar & Quick-Scroll Navigation */}
      <div className="lg:hidden space-y-2">
        {/* Mobile Header with Active Tab Indicator and Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center gap-2.5 pl-1 min-w-0">
            {tabs.find((t) => t.id === activeTab)?.icon && (
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#6D5DFC]/20 to-[#00D9FF]/20 text-[#6D5DFC] dark:text-[#00D9FF] shrink-0">
                {tabs.find((t) => t.id === activeTab)?.icon}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {mobileTitle}
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {tabs.find((t) => t.id === activeTab)?.label}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition min-h-[44px] cursor-pointer shrink-0 ml-2"
            aria-expanded={mobileDrawerOpen}
            aria-label="Basculer le menu de navigation"
          >
            {mobileDrawerOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="hidden sm:inline">{mobileDrawerOpen ? "Fermer" : "Tous les onglets"}</span>
          </button>
        </div>

        {/* Quick Horizontal Scrollable Pills for Fast Mobile Switching */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 px-0.5 scrollbar-none no-scrollbar"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 min-h-[40px] cursor-pointer select-none ${
                  isActive
                    ? "bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white shadow-md shadow-[#6D5DFC]/20"
                    : "bg-white/80 dark:bg-[#0D1220]/80 text-slate-700 dark:text-white/70 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400 dark:text-white/40"}>
                  {tab.icon}
                </span>
                <span>{tab.shortLabel || tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${getBadgeClass(
                      tab.badgeColor,
                      isActive
                    )}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Navigation Drawer Dropdown */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white/98 dark:bg-[#0D1220]/98 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-3 shadow-2xl space-y-1 z-30 relative"
          >
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-white/5 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
                {mobileTitle} • {tabs.length} sections
              </p>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl min-h-[46px] text-xs font-bold transition cursor-pointer text-left ${
                    isActive
                      ? "bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] text-white shadow-md"
                      : "text-slate-700 dark:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50"
                      }`}
                    >
                      {tab.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm leading-tight truncate">{tab.label}</p>
                      {tab.description && (
                        <p
                          className={`text-[11px] font-normal mt-0.5 truncate ${
                            isActive ? "text-white/80" : "text-slate-500 dark:text-white/40"
                          }`}
                        >
                          {tab.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {tab.badge !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-[#00D9FF]/15 text-[#00D9FF]"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                    <ChevronRight size={16} className={isActive ? "text-white/80" : "text-slate-400"} />
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation: Horizontal Tabs or Vertical Sidebar */}
      {layout === "vertical" ? (
        <nav
          className="hidden lg:flex flex-col gap-1.5 p-2 rounded-3xl bg-white/90 dark:bg-[#0D1220]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectTab(tab.id)}
                className={`relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer select-none min-h-[44px] ${
                  isActive
                    ? "text-white font-extrabold"
                    : "text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`sidebar-tab-pill-${storageKey || "default"}`}
                    className="absolute inset-0 bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] rounded-2xl shadow-md z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-slate-400 dark:text-white/40"}>
                    {tab.icon}
                  </span>
                  <div className="text-left">
                    <p className="leading-tight">{tab.label}</p>
                    {tab.description && (
                      <p
                        className={`text-[10px] font-normal ${
                          isActive ? "text-white/80" : "text-slate-400 dark:text-white/40"
                        }`}
                      >
                        {tab.description}
                      </p>
                    )}
                  </div>
                </div>

                {tab.badge !== undefined && (
                  <span
                    className={`relative z-10 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${getBadgeClass(
                      tab.badgeColor,
                      isActive
                    )}`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      ) : (
        <div className="hidden lg:block bg-slate-100/80 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/5">
          <nav
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none"
            role="tablist"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap min-h-[40px] cursor-pointer select-none ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900 dark:text-white/60 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId={`sidebar-tab-pill-${storageKey || "horizontal"}`}
                      className="absolute inset-0 bg-gradient-to-r from-[#6D5DFC] to-[#00D9FF] rounded-xl shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span className={isActive ? "text-white" : "text-slate-400 dark:text-white/40"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>

                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${getBadgeClass(
                        tab.badgeColor,
                        isActive
                      )}`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}

