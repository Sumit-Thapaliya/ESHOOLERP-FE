import type { Tenant } from "@/types/tenant";

const HEX = /^#[0-9a-f]{3,8}$/i;

export function TenantThemeStyle({ theme }: { theme?: Tenant["theme"] }) {
  if (!theme) return null;

  const vars: Record<string, string | undefined> = {
    "--primary": theme.primary,
    "--sidebar-primary": theme.primary,
    "--ring": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--sidebar-primary-foreground": theme.primaryForeground,
    "--secondary": theme.secondary,
    "--secondary-foreground": theme.secondaryForeground,
  };

  // only accept valid hex values, since this string goes into a <style> tag
  const css = Object.entries(vars)
    .filter(([, v]) => v && HEX.test(v))
    .map(([k, v]) => `${k}:${v};`)
    .join("");

  if (!css) return null;
  return <style dangerouslySetInnerHTML={{ __html: `:root,:root.dark{${css}}` }} />;
}