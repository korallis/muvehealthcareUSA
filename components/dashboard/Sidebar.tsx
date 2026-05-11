"use client";

import { useState, useTransition } from "react";
import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Newspaper,
  Calendar,
  HelpCircle,
  Link2,
  BookOpen,
  Files,
  LogOut,
  Tag,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const navItems = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Careers", path: "/dashboard/jobs", icon: Briefcase },
    { name: "News", path: "/dashboard/news", icon: Newspaper },
    { name: "Events", path: "/dashboard/events", icon: Calendar },
    { name: "FAQs", path: "/dashboard/faq", icon: HelpCircle },
    { name: "Quick Links", path: "/dashboard/quicklinks", icon: Link2 },
    { name: "Categories", path: "/dashboard/categories", icon: Tag },
    { name: "Stories", path: "/dashboard/stories", icon: BookOpen },
    { name: "Pages", path: "/dashboard/pages", icon: Files },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-slate-800 border border-slate-700 rounded-full p-1 text-white hover:bg-slate-700 z-10"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex-1 p-4 text-[20px]">
        {/* Admin Portal Text: Adjusted to 17px to be 15% smaller than 20px */}
        <h3
          className={`text-white font-lexendBold mb-8 uppercase text-[40px] ${isCollapsed ? "text-center" : ""}`}
        >
          {isCollapsed ? "Adm" : "Admin Portal"}
        </h3>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800/50 hover:text-white"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          disabled={isPending}
          title={isCollapsed ? "Logout" : ""}
          className={`flex w-full items-center gap-3 px-3 py-3 text-sm font-medium text-rose-400 rounded-lg transition-all hover:bg-rose-500/10 disabled:opacity-50 group ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut
            size={20}
            className={`transition-transform ${!isPending && "group-hover:-translate-x-1"}`}
          />
          {!isCollapsed && (
            <span>{isPending ? "Logging out..." : "Logout"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
