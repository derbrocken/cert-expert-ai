"use client";

import React from "react";
import { Navbar } from "@/components/layout";
import { EmployeeFileWorkspaceNotice } from "./EmployeeFileWorkspaceNotice";

export interface EmployeeFileWorkspaceLayoutProps {
  index: React.ReactNode;
  dossier: React.ReactNode;
  generateBar?: React.ReactNode;
  /** Rendered below fixed Navbar (e.g. company switcher) */
  toolbar?: React.ReactNode;
}

export const EmployeeFileWorkspaceLayout: React.FC<
  EmployeeFileWorkspaceLayoutProps
> = ({ index, dossier, generateBar, toolbar }) => {
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Navbar />

      <div className="pt-14">
        {toolbar ? (
          <div className="border-b border-[#e5e7eb] bg-[#fafbfc] px-4 py-2 sm:px-6">
            {toolbar}
          </div>
        ) : null}

        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
        <aside className="flex w-full flex-col border-b border-[#e5e7eb] bg-white lg:w-[min(100%,280px)] lg:shrink-0 lg:border-b-0 lg:border-r">
          {index}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[#e5e7eb] bg-white px-4 py-3 sm:px-6">
            <EmployeeFileWorkspaceNotice />
          </div>
          <main className="flex-1 overflow-auto">{dossier}</main>
          {generateBar ? (
            <div className="border-t border-[#e5e7eb] bg-white p-4 sm:px-6">
              {generateBar}
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </div>
  );
};

EmployeeFileWorkspaceLayout.displayName = "EmployeeFileWorkspaceLayout";
