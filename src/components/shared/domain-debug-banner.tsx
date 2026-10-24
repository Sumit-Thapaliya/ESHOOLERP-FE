"use client";

import { useEffect, useState } from "react";

export function DomainDebugBanner() {
  const [host, setHost] = useState<string | null>(null);

  useEffect(() => setHost(window.location.host), []);
  if (!host) return null;

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").split(":")[0];
  const hostname = host.split(":")[0];
  const sub = hostname.endsWith(`.${root}`)
    ? hostname.slice(0, -(root.length + 1))
    : null;

  return (
    <div className="bg-highlight px-4 py-2 text-center text-xs font-medium text-black">
      DEBUG · host: <b>{host}</b> · subdomain: <b>{sub ?? "none"}</b> · page: marketing
      {sub && " ⚠ proxy rewrite is NOT active (this page should be the tenant page)"}
    </div>
  );
}