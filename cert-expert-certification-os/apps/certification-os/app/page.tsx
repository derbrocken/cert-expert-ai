import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import { Users, Upload, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-orange-50">
      <Navbar />

      <main className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Cert-Expert Certification OS
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 sm:text-xl">
              Tool 2 — Employee document automation (Mitarbeiterakte). Register
              employees, assign roles and appointments, generate document
              packages.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/employee-automation"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-orange-500/30 transition-all hover:scale-105 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <Users className="h-5 w-5" />
                Employee Generator
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/uploads"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition-all hover:border-violet-300 hover:text-violet-600 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <Upload className="h-5 w-5" />
                Upload Manager
              </Link>
            </div>

            <p className="mt-10 text-sm text-gray-500">
              Tool 1 (Document Generator) remains in the legacy path and was not
              migrated in B3.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
