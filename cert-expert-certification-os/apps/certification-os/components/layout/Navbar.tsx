"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Upload, FileStack, LogOut } from "lucide-react";

interface NavbarProps {
  className?: string;
}

const NAV_ITEMS = [
  { href: "/employee-automation", label: "Mitarbeiterakte", icon: Users },
  { href: "/generator", label: "Generator", icon: FileStack },
  { href: "/uploads", label: "Upload-Manager", icon: Upload },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.assign("/login");
  }

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 w-full border-b border-[#e5e7eb] bg-white/95 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <Link href="/" className="flex items-center group shrink-0" title="Zur Übersicht">
            <Image
              src="/assets/cert-expert-logo.png"
              alt="Cert-Expert"
              width={228}
              height={48}
              className="h-8 w-auto max-w-[140px] object-contain transition-opacity group-hover:opacity-90 sm:h-9 sm:max-w-[210px]"
              priority
            />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
                    active
                      ? "border-[rgba(227,6,19,0.45)] bg-[rgba(227,6,19,0.06)] text-[#e30613]"
                      : "border-[#e5e7eb] bg-[#f1f3f6] text-[#111827] hover:border-[rgba(227,6,19,0.35)] hover:bg-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4",
                      active ? "text-[#e30613]" : "text-[#e30613]",
                    )}
                  />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              title="Abmelden"
              className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#f1f3f6] px-3 py-1.5 text-xs font-medium text-[#111827] transition-colors hover:border-[rgba(227,6,19,0.35)] hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
            >
              <LogOut className="h-3.5 w-3.5 text-[#6b7280] sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.displayName = "Navbar";
