import {
  Banknote,
  Bus,
  CalendarDays,
  ChartNoAxesColumn,
  CircleCheck,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  tone?: "info" | "warn";
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Students", href: "/students", icon: Users, badge: "12", tone: "info" },
      { name: "Teachers", href: "/teachers", icon: GraduationCap },
      { name: "Classes", href: "/classes", icon: Layers },
      { name: "Attendance", href: "/attendance", icon: CircleCheck },
      { name: "Exams", href: "/exams", icon: ClipboardList },
      { name: "Fees", href: "/fees", icon: Wallet, badge: "3", tone: "warn" },
      { name: "Timetable", href: "/timetable", icon: CalendarDays },
    ],
  },
  {
    label: "Administration",
    items: [
      { name: "Payroll", href: "/payroll", icon: Banknote },
      { name: "Transport", href: "/transport", icon: Bus },
      { name: "Reports", href: "/reports", icon: ChartNoAxesColumn },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
