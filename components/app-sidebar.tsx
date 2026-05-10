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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Map },
  { href: "/cities", label: "Cities", icon: Building2 },
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
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-[#0D1B2A] px-4 md:hidden">
        <span className="font-(family-name:--font-heading) text-lg text-[#F5ECD7]">
          Traveloop
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#F5ECD7]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-16 flex-col bg-[#0D1B2A] transition-all duration-300 ease-in-out hover:w-56 group max-md:top-14 max-md:w-64 max-md:-translate-x-full max-md:hover:w-64 ${mobileOpen ? "max-md:translate-x-0" : ""}`}
      >
        {/* Logo / Brand */}
        <div className="flex h-14 items-center px-4 max-md:hidden">
          <span className="truncate font-(family-name:--font-heading) text-xl text-[#F5ECD7] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
                    ? "bg-[#FF5733]/20 text-[#FF5733]"
                    : "text-[#A0AEBF] hover:bg-[#1B2838] hover:text-[#F5ECD7]"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute left-0 h-8 w-1 rounded-r bg-[#FF5733] max-md:hidden" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user name + sign out */}
        <div className="border-t border-[#1B2838] px-2 py-3">
          {userName && (
            <div className="mb-2 truncate px-3 text-xs text-[#A0AEBF] opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
              {userName}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#A0AEBF] transition-colors hover:bg-[#1B2838] hover:text-[#F5ECD7]"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="truncate opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:opacity-100">
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
