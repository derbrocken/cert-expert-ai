"use client";

import React from "react";
import { Navbar, Footer } from "@/components/layout";
import CEBadge from "@/components/ui/CEBadge";
import { ModelCreatorWorkspace } from "./ModelCreatorWorkspace";

export default function ModelCreatorPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <main className="pt-20 pb-8 px-4 sm:pt-24 sm:pb-12">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 text-center sm:mb-8">
            <div className="flex justify-center gap-4">
              <CEBadge />
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Dokument-Generator
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-600 sm:text-base lg:text-lg">
              Standard-Model-Ordner wählen, Platzhalter ausfüllen und als
              ZIP-Paket generieren
            </p>
          </div>

          {/* Main Content — form + tree panel side by side */}
          <ModelCreatorWorkspace />
        </div>
      </main>

      <Footer />
    </div>
  );
}
