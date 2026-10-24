import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  Landmark,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggler } from "@/components/shared/theme-switcher";
import { cn } from "@/lib/utils";
import { CopyrightYear } from "@/components/shared/copyright-year";

const modules = [
  {
    title: "Inventory",
    desc: "Track stock levels, warehouses and movements in real time.",
    icon: Boxes,
    color: "bg-chart-1/10 text-chart-1",
  },
  {
    title: "Sales",
    desc: "Quotations, orders and invoices in one streamlined flow.",
    icon: ShoppingCart,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    title: "Purchases",
    desc: "Manage suppliers, purchase orders and goods receipts.",
    icon: Truck,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    title: "Accounting",
    desc: "Ledgers, payments and financial statements made simple.",
    icon: Landmark,
    color: "bg-chart-3/10 text-chart-3",
  },
  {
    title: "Human Resources",
    desc: "Employees, attendance, leave and payroll in one place.",
    icon: Users,
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    title: "Reports",
    desc: "Clear dashboards and exports to support better decisions.",
    icon: BarChart3,
    color: "bg-chart-2/10 text-chart-2",
  },
];

const stats = [
  { label: "Total Sales", value: "Rs 4,82,500", change: "+12.5%" },
  { label: "Open Orders", value: "128", change: "+4.1%" },
  { label: "Low Stock Items", value: "17", change: "-2.3%" },
  { label: "Active Employees", value: "64", change: "+1.6%" },
];

const bars = [40, 65, 50, 80, 60, 90, 72];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Baudhika <span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              // href="/login"
              href={"/"}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden sm:inline-flex",
              )}
            >
              Sign in
            </Link>
            <ThemeToggler />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-primary/10 via-secondary/40 to-transparent"
          />
          <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-chart-2" />
              Everything your business needs, in one place
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Run your whole business with{" "}
              <span className="text-primary">one simple system</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Manage inventory, sales, purchases, accounts and people from a
              single, fast and easy-to-use platform built for growing teams.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                // href="/login"
                href={"/"}
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#modules"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Explore modules
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard preview (static placeholder data) */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-muted/50 p-4"
                >
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">
                    {s.value}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      s.change.startsWith("-")
                        ? "text-destructive"
                        : "text-chart-2",
                    )}
                  >
                    {s.change} this month
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Weekly sales overview</p>
                <p className="text-xs text-muted-foreground">Sample data</p>
              </div>
              <div className="mt-4 flex h-40 items-end gap-2 sm:gap-4">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Modules */}
        <section
          id="modules"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Modules that work together
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Start with what you need today and add more as your business
              grows.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ title, desc, icon: Icon, color }) => (
              <div
                key={title}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg",
                    color,
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
          <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to simplify your operations?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
              Sign in to your workspace and start managing everything from one
              dashboard.
            </p>
            <Link
              // href="/login"
              href={"/"}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mt-6 gap-2",
              )}
            >
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © <CopyrightYear /> Baudhika ERP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
