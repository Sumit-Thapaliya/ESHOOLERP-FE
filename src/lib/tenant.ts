"use server";

import { cacheLife, cacheTag } from "next/cache";
import type { Tenant } from "@/types/tenant";

export async function getTenant(slug: string): Promise<Tenant | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`tenant-${slug}`);

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const host = `${slug}.${rootDomain}`;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/public/tenants/resolve?host=${encodeURIComponent(host)}`;
  const res = await fetch(url);
  console.log("[getTenant]", url, res.status);
  // if (res.status === 404) return null;
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Tenant lookup failed (${res.status})`);
  // return res.json();
  const raw: Tenant = await res.json();
  const name = raw.name?.trim() || raw.slug;
  return {
    ...raw,
    name,
    shortName: raw.shortName?.trim() || name,
    logoUrl: raw.logoUrl || null,
    faviconUrl: raw.faviconUrl || null,
    description: raw.description || null,
    language: raw.language || "en",
    theme: raw.theme ?? null,
  };
}
