"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, Shield, UserRound } from "lucide-react";
import { cn } from "cn";
import { ThemeToggler } from "@/components/shared/theme-switcher";
import { clearSession, type Session } from "@/lib/auth";
import { useBasePath } from "@/hooks/use-base-path";

type AppNavbarProps = {
  session: Session;
  onOpenMobile: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function AppNavbar({ session, onOpenMobile }: AppNavbarProps) {
  const router = useRouter();
  const base = useBasePath();
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function signOut() {
    clearSession();
    router.replace(`${base}/login`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-md sm:px-5">
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open menu"
        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="size-[18px]" />
      </button>

      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          type="search"
          placeholder="Search students, classes, invoices…"
          aria-label="Search"
          className="h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-14 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/20"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-highlight ring-2 ring-background" />
        </button>

        <ThemeToggler />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="flex h-9 items-center gap-2 rounded-lg border border-transparent px-1.5 transition-colors hover:border-border hover:bg-muted"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {initials(session.name)}
            </span>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-[130px] truncate text-[12.5px] font-semibold leading-tight">
                {session.name}
              </span>
              <span className="block text-[10.5px] text-muted-foreground">{session.role}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </button>

          {open ? (
            <div className="absolute right-0 top-[calc(100%+6px)] w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
              <div className="flex items-center gap-2.5 border-b border-border p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
                  {initials(session.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-semibold">{session.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{session.email}</p>
                </div>
              </div>

              <div className="p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors hover:bg-muted"
                >
                  <UserRound className="size-3.5 text-muted-foreground" />
                  My profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors hover:bg-muted"
                >
                  <Settings className="size-3.5 text-muted-foreground" />
                  Account settings
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] transition-colors hover:bg-muted"
                >
                  <Shield className="size-3.5 text-muted-foreground" />
                  Security &amp; sessions
                </button>
              </div>

              <div className="border-t border-border p-1">
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
