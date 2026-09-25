import { NavLink } from "react-router-dom";
import { Leaf } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import {
  mainNavItems,
  phaseNavItems,
  utilityNavItems,
} from "@/utils/navigation";

function NavSection({
  label,
  items,
}: {
  label: string;
  items: typeof mainNavItems;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Leaf className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground">
            Vivature
          </p>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <NavSection label="Overview" items={mainNavItems} />
          <Separator />
          <NavSection label="Pipeline" items={phaseNavItems} />
          <Separator />
          <NavSection label="Tools" items={utilityNavItems} />
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">
          Precision Agriculture Platform
        </p>
      </div>
    </aside>
  );
}
