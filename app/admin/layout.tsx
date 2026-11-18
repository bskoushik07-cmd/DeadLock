"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DeadlockIcon } from "@/components/logo/DeadlockIcon";
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  Sliders,
  ExternalLink,
  LogOut,
  Terminal,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Skip admin sidebar layout on login screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    soundManager.playMechanicalLock();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navLinks = [
    { label: "01/ DASHBOARD", href: "/admin", icon: LayoutDashboard },
    { label: "02/ PROJECTS CRUD", href: "/admin/projects", icon: FolderGit2 },
    { label: "03/ INQUIRIES", href: "/admin/messages", icon: Mail },
    { label: "04/ SITE SETTINGS", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#F4F4F0] flex flex-col md:flex-row selection:bg-[#C6FF3D] selection:text-[#070709]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F0F13] border-b md:border-b-0 md:border-r border-[rgba(255,255,255,0.08)] flex flex-col justify-between shrink-0 p-6">
        <div>
          {/* Logo & Version */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <DeadlockIcon size={32} variant="default" />
            <div>
              <span className="font-extrabold text-sm tracking-wider block">DEADLOCK</span>
              <span className="font-mono text-[10px] text-[#C6FF3D]">ADMIN CORE v1.0</span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5 font-mono text-xs">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => soundManager.playHoverBlip()}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm transition-colors ${
                    isActive
                      ? "bg-[#C6FF3D] text-[#070709] font-bold"
                      : "text-[#8A8A93] hover:text-[#F4F4F0] hover:bg-[#16161D]"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-[#070709]" : "text-[#C6FF3D]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] space-y-3 font-mono text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-[#8A8A93] hover:text-[#C6FF3D] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal size={13} />
              <span>LIVE SITE</span>
            </span>
            <ExternalLink size={12} />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-[#8A8A93] hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={13} />
            <span>DISENGAGE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Stage */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
