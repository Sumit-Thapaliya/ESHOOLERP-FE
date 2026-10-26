"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { AppNavbar } from "@/components/shared/app-navbar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { useSession } from "@/hooks/use-session";
import { clearSession } from "@/lib/auth";
import { useBasePath } from "@/hooks/use-base-path";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const base = useBasePath();
  const { session, loading } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !session) router.replace(`${base}/login`);
  }, [loading, session, router, base]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onSignOut={() => {
          clearSession();
          router.replace(`${base}/login`);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar session={session} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 px-3 py-4 sm:px-5 sm:py-5">{children}</main>
      </div>
    </div>
  );
}
