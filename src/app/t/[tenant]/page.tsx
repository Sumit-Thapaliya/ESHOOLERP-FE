"use client";

import { useTenant } from "@/providers/tenant-provider";
import { TenantLogo } from "@/components/tenant/tenant-logo";
import { Button } from "@/components/ui/button";

export default function TenantHome() {
  const { tenant } = useTenant();

  return (
    <main className="flex flex-col items-start gap-4 p-8">
      <TenantLogo className="size-16" />
      <h1 className="text-2xl font-semibold">{tenant.name}</h1>
      <p className="text-muted-foreground">{tenant.description}</p>
      <Button>Primary button</Button>
      <Button variant="secondary">Secondary button</Button>
    </main>
  );
}
