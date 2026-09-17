"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  AlertTriangle,
  Settings,
  Terminal,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Logs", href: "/logs", icon: ScrollText },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen bg-bgSecondary border-r border-borderColor flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-borderColor">
        <div className="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-accent" />
        </div>
        <span className="font-semibold text-[15px] tracking-tight">
          DevOps AI
        </span>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2.5 pl-3 pr-3 py-2 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "bg-white/[0.04] text-white font-medium"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-accent" />
              )}
              <Icon className="w-[15px] h-[15px]" strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-borderColor">
        <div className="flex items-center gap-2 text-[11px] text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="font-mono">system operational</span>
        </div>
      </div>
    </aside>
  );
}