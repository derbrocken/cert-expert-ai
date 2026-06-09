import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 w-full border-b border-[#e5e7eb] bg-white/95 backdrop-blur-xl",
        className,
      )}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link href="/" className="flex items-center group" title="Cert-Expert">
            <Image
              src="/assets/cert-expert-logo.png"
              alt="Cert-Expert"
              width={228}
              height={48}
              className="h-8 w-auto max-w-[180px] object-contain transition-opacity group-hover:opacity-90 sm:h-9 sm:max-w-[210px]"
              priority
            />
          </Link>

          <Link
            href="/uploads"
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-[#f1f3f6] px-3 py-1.5 text-xs font-medium text-[#111827] transition-colors hover:border-[rgba(227,6,19,0.35)] hover:bg-white sm:px-4 sm:py-2 sm:text-sm"
          >
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#e30613]" />
            <span className="hidden sm:inline">Upload Manager</span>
            <span className="sm:hidden">Upload</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

Navbar.displayName = "Navbar";
