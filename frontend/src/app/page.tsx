"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeroBanner from "@/components/HeroBanner";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <HeroBanner />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
