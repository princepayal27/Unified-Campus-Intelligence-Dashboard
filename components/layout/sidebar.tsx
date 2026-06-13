// components/layout/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  UtensilsCrossed,
  GraduationCap,
  Bot,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Cafeteria", href: "/cafeteria", icon: UtensilsCrossed },
  { label: "Academics", href: "/academics", icon: GraduationCap },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r border-border bg-surface transition-all duration-200 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-border">
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-foreground">
            Campus<span className="text-accent">AI</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-default hover:bg-surface-hover transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-default px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "hover:bg-surface-hover hover:translate-x-0.5",
                isActive
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3 rounded-default px-3 py-2.5 bg-surface-hover/50",
            collapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
            AS
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Aarav Sharma</p>
              <p className="text-xs text-muted truncate">CS, Year 3</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}