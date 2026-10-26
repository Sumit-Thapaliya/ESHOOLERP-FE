"use client";

import { usePathname } from "next/navigation";

export function useBasePath() {
  const pathname = usePathname();
  const match = /^\/t\/[^/]+/.exec(pathname);
  return match ? match[0] : "";
}
