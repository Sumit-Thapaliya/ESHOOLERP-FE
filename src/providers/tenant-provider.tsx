"use client";

import { createContext, useContext } from "react";

type TenantCtx = { slug: string };
const Ctx = createContext<TenantCtx | null>(null);

export function TenantProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ slug }}>{children}</Ctx.Provider>;
}

export function useTenant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTenant must be used inside <TenantProvider>");
  return ctx;
}