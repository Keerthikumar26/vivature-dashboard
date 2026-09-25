import {
  LayoutDashboard,
  Leaf,
  MapPin,
  AlertTriangle,
  Route,
  Droplets,
  Navigation,
  BarChart3,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  group?: string;
}

export const mainNavItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    group: "Overview",
  },
];

export const phaseNavItems: NavigationItem[] = [
  {
    title: "Phase 1 – Crop Health",
    href: "/phase1",
    icon: Leaf,
    group: "Pipeline",
  },
  {
    title: "Phase 2 – GPS Mapping",
    href: "/phase2",
    icon: MapPin,
    group: "Pipeline",
  },
  {
    title: "Phase 3 – Stress Zones",
    href: "/phase3",
    icon: AlertTriangle,
    group: "Pipeline",
  },
  {
    title: "Phase 4 – Coverage Path",
    href: "/phase4",
    icon: Route,
    group: "Pipeline",
  },
  {
    title: "Phase 5 – Spray Mission",
    href: "/phase5",
    icon: Droplets,
    group: "Pipeline",
  },
  {
    title: "Phase 6 – Mission Planner",
    href: "/phase6",
    icon: Navigation,
    group: "Pipeline",
  },
];

export const utilityNavItems: NavigationItem[] = [
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    group: "Tools",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    group: "Tools",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    group: "Tools",
  },
];

export const allNavItems: NavigationItem[] = [
  ...mainNavItems,
  ...phaseNavItems,
  ...utilityNavItems,
];

export function getPageTitle(pathname: string): string {
  const item = allNavItems.find((nav) => nav.href === pathname);
  return item?.title ?? "Vivature Dashboard";
}
