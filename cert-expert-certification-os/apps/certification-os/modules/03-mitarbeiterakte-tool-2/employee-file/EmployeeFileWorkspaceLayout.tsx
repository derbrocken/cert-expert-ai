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
  // #B Layout: Der fixe Navbar ist h-14 (mobil) / sm:h-16 (≥640px) — der
  // Inhalt muss exakt so weit nach unten versetzt werden (pt-14 sm:pt-16),
  // sonst verdeckt der Navbar oben 8px (Übersicht „abgeschnitten").
  // Ab lg wird die Akte-Shell auf Viewport-Höhe begrenzt; Index + Hauptbereich
  // scrollen intern, Toolbar/Notice/Generate-Bar bleiben fixiert → kein
  // Seiten-Scroll-Sprung beim Öffnen. Unter lg bleibt der natürliche Fluss.
  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <Navbar />

      <div className="flex flex-col pt-14 sm:pt-16 lg:h-screen">
        {toolbar ? (
          <div className="shrink-0 border-b border-[#e5e7eb] bg-[#fafbfc] px-4 py-2 sm:px-6">
            {toolbar}
          </div>
        ) : null}

        <div className="flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-1 flex-col sm:min-h-[calc(100dvh-4rem)] lg:min-h-0 lg:flex-row">
          <aside className="flex w-full min-w-0 flex-col border-b border-[#e5e7eb] bg-white lg:w-[min(100%,280px)] lg:shrink-0 lg:overflow-hidden lg:border-b-0 lg:border-r">
            {index}
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="shrink-0 border-b border-[#e5e7eb] bg-white px-4 py-3 sm:px-6">
              <EmployeeFileWorkspaceNotice />
            </div>
            <main className="min-h-0 flex-1 overflow-auto">{dossier}</main>
            {generateBar ? (
              <div className="shrink-0 border-t border-[#e5e7eb] bg-white p-4 sm:px-6">
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
