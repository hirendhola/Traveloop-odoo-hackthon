"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Map,
  Building2,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/trips", label: "Trips", icon: Map },
  { href: "/cities", label: "Search", icon: Building2 },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-[#0D1218] px-4 md:hidden border-b border-[rgba(255,255,255,0.06)]">
        <span className="font-heading text-lg text-[#F0EDE6]">
          Traveloop
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#F0EDE6]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-16 flex-col bg-[#0D1218] border-r border-[rgba(255,255,255,0.06)] transition-all duration-300 ease-in-out hover:w-56 group max-md:top-14 max-md:w-64 max-md:-translate-x-full max-md:hover:w-64 ${mobileOpen ? "max-md:translate-x-0" : ""}`}
      >
        {/* Logo / Brand */}
        <div className="flex h-14 items-center px-4 max-md:hidden">
          <span className="truncate font-heading text-xl text-[#F0EDE6] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Traveloop
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-[rgba(232,197,71,0.12)] text-[#E8C547]"
                    : "text-[rgba(240,237,230,0.55)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F0EDE6]"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute left-0 h-8 w-1 rounded-r bg-[#E8C547] max-md:hidden" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user name + sign out */}
        <div className="border-t border-[rgba(255,255,255,0.06)] px-2 py-3">
          {userName && (
            <div className="mb-2 truncate px-3 text-xs text-[rgba(240,237,230,0.4)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
              {userName}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[rgba(240,237,230,0.55)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#F0EDE6]"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[rgba(255,255,255,0.06)] bg-[rgba(13,18,24,0.92)] px-2 pb-safe pt-2 backdrop-blur-lg md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors ${
                isActive ? "text-[#E8C547]" : "text-[rgba(240,237,230,0.45)]"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
