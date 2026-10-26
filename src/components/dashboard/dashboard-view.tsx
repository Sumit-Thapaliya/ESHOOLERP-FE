"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Download,
  Plus,
  Receipt,
  Users,
  Wallet,
  TriangleAlert,
  UserPlus,
  Bus,
} from "lucide-react";
import { cn } from "cn";
import { useSession } from "@/hooks/use-session";
import { useTenant } from "@/providers/tenant-provider";

const MONTHS = ["Bai", "Jes", "Ash", "Shr", "Bha", "Aso", "Kar", "Man"];
const COLLECTED = [58, 66, 61, 74, 70, 83, 79, 94];

const KPIS = [
  {
    label: "Total students",
    value: "1,248",
    delta: "+4.2%",
    note: "vs last term",
    up: true,
    accent: "--chart-1",
    icon: Users,
    series: [40, 44, 43, 52, 50, 58, 61, 66],
  },
  {
    label: "Teaching staff",
    value: "86",
    delta: "+2",
    note: "new this month",
    up: true,
    accent: "--chart-2",
    icon: UserPlus,
    series: [60, 60, 63, 62, 66, 67, 70, 72],
  },
  {
    label: "Fees collected",
    value: "Rs 82.4L",
    delta: "+6.8%",
    note: "of Rs 1.02Cr",
    up: true,
    accent: "--chart-3",
    icon: Wallet,
    series: [30, 38, 35, 48, 46, 60, 57, 74],
  },
  {
    label: "Overdue invoices",
    value: "23",
    delta: "-3",
    note: "since last week",
    up: false,
    accent: "--chart-4",
    icon: TriangleAlert,
    series: [70, 66, 68, 58, 60, 48, 46, 34],
  },
];

const GRADE_FEES = [
  { grade: "Grade 6", collected: 96, students: 214 },
  { grade: "Grade 7", collected: 91, students: 228 },
  { grade: "Grade 8", collected: 84, students: 246 },
  { grade: "Grade 9", collected: 72, students: 261 },
  { grade: "Grade 10", collected: 63, students: 299 },
];

const ATTENDANCE = [
  { label: "Present", value: 94, color: "--teal" },
  { label: "On leave", value: 1.5, color: "--highlight" },
  { label: "Absent", value: 4.5, color: "--destructive" },
];

const EXAMS = [
  { subject: "Mathematics", grade: "Grade 10", date: "Oct 28", count: "192 students" },
  { subject: "Science", grade: "Grade 9", date: "Oct 30", count: "178 students" },
  { subject: "Nepali", grade: "Grade 10", date: "Nov 02", count: "192 students" },
  { subject: "Social Studies", grade: "Grade 8", date: "Nov 05", count: "246 students" },
];

const ADMISSIONS = [
  { name: "Aarav Sharma", grade: "Grade 6", time: "Today · 09:12", status: "Verified" },
  { name: "Priya Thapa", grade: "Grade 9", time: "Today · 08:47", status: "Verified" },
  { name: "Bikash Gurung", grade: "Grade 7", time: "Yesterday · 16:20", status: "Pending" },
  { name: "Sneha Karki", grade: "Grade 10", time: "Yesterday · 14:05", status: "Verified" },
  { name: "Rohan Adhikari", grade: "Grade 8", time: "2 days ago", status: "Pending" },
];

function titleize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function MiniSparkline({ series, color }: { series: number[]; color: string }) {
  const width = 84;
  const height = 28;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min || 1;
  const step = width / (series.length - 1);

  const points = series
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-[84px] shrink-0" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function FeeAreaChart({ values }: { values: number[] }) {
  const width = 600;
  const height = 170;
  const max = 100;
  const step = width / (values.length - 1);

  const coords = values.map((value, index) => ({
    x: index * step,
    y: height - (value / max) * height,
  }));

  const line = coords
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[170px] w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="fee-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={width}
            y1={height - height * ratio}
            y2={height - height * ratio}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        ))}

        <path d={area} fill="url(#fee-area-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {coords.map((point) => (
          <circle
            key={point.x}
            cx={point.x}
            cy={point.y}
            r="3.4"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="mt-1.5 flex">
        {MONTHS.map((month) => (
          <span key={month} className="flex-1 text-center text-[10px] text-muted-foreground">
            {month}
          </span>
        ))}
      </div>
    </div>
  );
}

function AttendanceDonut() {
  const radius = 46;
  const stroke = 13;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative grid size-[128px] shrink-0 place-items-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth={stroke} className="stroke-border" />
        {ATTENDANCE.map((segment) => {
          const length = (segment.value / 100) * circumference;
          const dash = `${length} ${circumference - length}`;
          const dashOffset = -offset;
          offset += length;
          return (
            <circle
              key={segment.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={dashOffset}
              stroke={`var(${segment.color})`}
            />
          );
        })}
      </svg>
      <div className="text-center leading-none">
        <p className="text-[22px] font-semibold tracking-[-0.03em]">94%</p>
        <p className="mt-1 text-[9.5px] uppercase tracking-[0.08em] text-muted-foreground">present</p>
      </div>
    </div>
  );
}

export function DashboardView() {
  const { slug } = useTenant();
  const { session } = useSession();
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    );
  }, []);

  const school = `${titleize(slug)} School`;
  const firstName = session?.name.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[23px] font-semibold tracking-[-0.028em]">
              Good morning, {firstName}
            </h1>
            <span className="hidden rounded-full border border-teal/40 bg-teal/10 px-2 py-0.5 text-[10.5px] font-medium text-teal sm:inline">
              Live
            </span>
          </div>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {school} · Academic year 2083{today ? ` · ${today}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Period"
            className="h-9 rounded-lg border border-input bg-background px-2.5 text-[12.5px] outline-none focus:border-ring focus:ring-3 focus:ring-ring/20"
          >
            <option>This term</option>
            <option>This month</option>
            <option>This year</option>
          </select>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[12.5px] font-medium transition-colors hover:bg-muted"
          >
            <Download className="size-3.5" />
            Export
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[12.5px] font-medium transition-colors hover:bg-muted"
          >
            <Receipt className="size-3.5" />
            Collect fee
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-[12.5px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <Plus className="size-3.5" />
            New admission
          </button>
        </div>
      </div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, var(${kpi.accent}), transparent)` }}
              />
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-md"
                  style={{
                    backgroundColor: `color-mix(in srgb, var(${kpi.accent}) 14%, transparent)`,
                    color: `var(${kpi.accent})`,
                  }}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="truncate text-[11.5px] text-muted-foreground">{kpi.label}</span>
              </div>

              <p className="text-[26px] font-semibold leading-none tracking-[-0.035em]">{kpi.value}</p>

              <div className="mt-2.5 flex items-end justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 font-medium",
                      kpi.up ? "text-teal" : "text-destructive",
                    )}
                  >
                    {kpi.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {kpi.delta}
                  </span>
                  {kpi.note}
                </div>
                <MiniSparkline series={kpi.series} color={`var(${kpi.accent})`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-3 grid gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm xl:col-span-2">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-[13.5px] font-semibold">Fee collection trend</h2>
              <p className="text-[11.5px] text-muted-foreground">
                Collected vs target · Nepali fiscal months
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-0.5 w-3.5 rounded-full bg-primary" />
                Collected
              </span>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 font-medium text-teal">
                +6.8% MoM
              </span>
            </div>
          </div>

          <FeeAreaChart values={COLLECTED} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-[13.5px] font-semibold">Attendance today</h2>
              <p className="text-[11.5px] text-muted-foreground">1,248 enrolled</p>
            </div>
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>

          <div className="mt-2 flex items-center gap-4">
            <AttendanceDonut />

            <div className="grid min-w-0 flex-1 gap-2.5">
              {ATTENDANCE.map((segment) => (
                <div key={segment.label}>
                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: `var(${segment.color})` }}
                      />
                      {segment.label}
                    </span>
                    <span className="font-medium tabular-nums">{segment.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg border border-highlight/40 bg-highlight/10 p-2.5">
            <TriangleAlert className="size-3.5 shrink-0 text-[color-mix(in_srgb,var(--highlight)_60%,var(--foreground))]" />
            <p className="text-[11.5px] text-[color-mix(in_srgb,var(--highlight)_45%,var(--foreground))]">
              23 invoices overdue · reminders ready
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3 grid gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-[13.5px] font-semibold">Fee collection by grade</h2>
              <p className="text-[11.5px] text-muted-foreground">This term · share of billed amount</p>
            </div>
            <span className="text-[11px] text-muted-foreground">Rs 82.4L / 1.02Cr</span>
          </div>

          <div className="grid gap-2.5">
            {GRADE_FEES.map((grade) => (
              <div key={grade.grade} className="flex items-center gap-3">
                <span className="w-[62px] shrink-0 text-[11.5px] text-muted-foreground">
                  {grade.grade}
                </span>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      grade.collected >= 90
                        ? "bg-teal"
                        : grade.collected >= 75
                          ? "bg-primary"
                          : "bg-highlight",
                    )}
                    style={{ width: `${grade.collected}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right text-[11.5px] font-medium tabular-nums">
                  {grade.collected}%
                </span>
                <span className="hidden w-16 shrink-0 text-right text-[10.5px] text-muted-foreground sm:block">
                  {grade.students} st.
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-[13.5px] font-semibold">Upcoming exams</h2>
              <p className="text-[11.5px] text-muted-foreground">Term II schedule</p>
            </div>
            <ClipboardList className="size-4 text-muted-foreground" />
          </div>

          <div className="divide-y divide-border">
            {EXAMS.map((exam) => (
              <div key={`${exam.subject}-${exam.grade}`} className="flex items-center gap-3 px-4 py-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                  <CalendarDays className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{exam.subject}</p>
                  <p className="text-[10.5px] text-muted-foreground">
                    {exam.grade} · {exam.count}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                  {exam.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h2 className="text-[13.5px] font-semibold">Recent admissions</h2>
              <p className="text-[11.5px] text-muted-foreground">Document verification queue</p>
            </div>
            <button
              type="button"
              className="text-[12px] font-medium text-primary underline-offset-4 hover:underline"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-border">
            {ADMISSIONS.map((row) => (
              <div key={row.name} className="flex items-center gap-3 px-4 py-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-[10.5px] font-semibold text-secondary-foreground">
                  {row.name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium">{row.name}</p>
                  <p className="text-[10.5px] text-muted-foreground">
                    {row.grade} · {row.time}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
                    row.status === "Verified"
                      ? "bg-teal/10 text-teal"
                      : "bg-highlight/12 text-[color-mix(in_srgb,var(--highlight)_55%,var(--foreground))]",
                  )}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-[13.5px] font-semibold">Quick actions</h2>
          <p className="text-[11.5px] text-muted-foreground">Common admin tasks</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "Add student", icon: UserPlus },
              { label: "Collect fee", icon: Receipt },
              { label: "Publish result", icon: ClipboardList },
              { label: "Bus routes", icon: Bus },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  className="flex flex-col items-start gap-2 rounded-lg border border-border p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-muted/60"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="text-[11.5px] font-medium leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
