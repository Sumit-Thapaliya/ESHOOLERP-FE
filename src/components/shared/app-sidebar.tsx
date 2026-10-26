"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, GraduationCap, HelpCircle, LogOut } from "lucide-react";
import { cn } from "cn";
import { NAV_GROUPS } from "@/config/nav";
import { useTenant } from "@/providers/tenant-provider";
import { useBasePath } from "@/hooks/use-base-path";

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSignOut: () => void;
};

function titleize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AppSidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  onSignOut,
}: AppSidebarProps) {
  const pathname = usePathname();
  const base = useBasePath();
  const { slug } = useTenant();
  const relative = pathname.startsWith(base)
    ? pathname.slice(base.length) || "/"
    : pathname;
  const school = `${titleize(slug)} School`;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[278px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300",
          "lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 lg:transition-[width] lg:shadow-none",
          collapsed ? "lg:w-[78px]" : "lg:w-[266px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center gap-2.5 border-b border-sidebar-border px-3 py-3.5",
            collapsed && "lg:justify-center lg:px-2",
          )}
        >
          <button
            type="button"
            onClick={collapsed ? onToggleCollapsed : undefined}
            aria-label={collapsed ? "Expand sidebar" : undefined}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-[11px] bg-primary text-primary-foreground shadow-sm",
              collapsed && "cursor-pointer transition-transform hover:scale-105",
            )}
          >
            <GraduationCap className="size-[18px]" />
          </button>

          <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
            <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{school}</p>
            <p className="truncate text-[10.5px] text-muted-foreground">Baudhika ERP</p>
          </div>

          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse sidebar"
            className={cn(
              "hidden size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground lg:grid",
              collapsed && "lg:hidden",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4 last:mb-0">
              <p
                className={cn(
                  "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                  collapsed && "lg:sr-only",
                )}
              >
                {group.label}
              </p>

              <div className="grid gap-0.5">
                {group.items.map((item) => {
                  const active =
                    relative === item.href || relative.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={`${base}${item.href}`}
                      onClick={onCloseMobile}
                      title={collapsed ? item.name : undefined}
                      className={cn(
                        "group relative flex h-9 items-center gap-2.5 rounded-lg px-2 text-[13px] transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        collapsed && "lg:justify-center lg:px-0",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[17px] shrink-0",
                          active ? "text-sidebar-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className={cn("truncate", collapsed && "lg:hidden")}>
                        {item.name}
                      </span>

                      {item.badge ? (
                        <span
                          className={cn(
                            "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                            item.tone === "warn"
                              ? "bg-highlight/15 text-[color-mix(in_srgb,var(--highlight)_55%,var(--foreground))]"
                              : "bg-info/15 text-[color-mix(in_srgb,var(--info)_55%,var(--foreground))]",
                            collapsed && "lg:hidden",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}

                      {collapsed ? (
                        <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[11.5px] text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 lg:block">
                          {item.name}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-2.5">
          <button
            type="button"
            className={cn(
              "flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <HelpCircle className="size-[17px] shrink-0 text-teal" />
            <span className={cn("truncate", collapsed && "lg:hidden")}>Help &amp; support</span>
          </button>

          <button
            type="button"
            onClick={onSignOut}
            className={cn(
              "flex h-9 w-full items-center gap-2.5 rounded-lg px-2 text-[13px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              collapsed && "lg:justify-center lg:px-0",
            )}
          >
            <LogOut className="size-[17px] shrink-0" />
            <span className={cn("truncate", collapsed && "lg:hidden")}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
