import { TenantProvider } from "@/providers/tenant-provider";

export const instant = false;   

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  // TODO: once your backend has a tenant lookup endpoint, validate the slug here
  // and call notFound() if it doesn't exist.

  return <TenantProvider slug={tenant}>{children}</TenantProvider>;
}