"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Search, ShoppingCart, Heart, GraduationCap } from "lucide-react";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold text-gray-900"
          >
            <GraduationCap className="h-8 w-8 text-accent" aria-hidden />
            <span className="hidden sm:inline">LMS</span>
          </Link>

          <Link
            href="/explore"
            className="shrink-0 text-sm font-semibold text-gray-700 hover:text-accent"
          >
            Explore
          </Link>

          <div className="mx-auto hidden max-w-2xl flex-1 md:block">
            <label className="relative block">
              <span className="sr-only">Search courses</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search for anything"
                readOnly
                className="w-full cursor-default rounded-full border border-border-soft bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </label>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {user && (
          <Link
            href="/subjects"
            className="hidden whitespace-nowrap px-2 text-sm font-semibold text-gray-700 hover:text-accent sm:inline"
          >
            My Learning
          </Link>
        )}
        <button
          type="button"
          className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-accent"
          aria-label="Wishlist"
        >
          <Heart className="h-6 w-6" />
        </button>
        <button
          type="button"
          className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-accent"
          aria-label="Cart"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>
        {user ? (
          <Link
            href="/profile"
            className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white ring-2 ring-white transition hover:bg-accent-hover"
            title={user.name || user.email}
          >
            {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="ml-1 rounded-full border border-border-soft px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-gray-300"
          >
            Log in
          </Link>
        )}
        </div>
      </div>

      <div className="border-t border-border-soft px-4 py-2.5 md:hidden">
        <label className="relative block">
          <span className="sr-only">Search courses</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search for anything"
            readOnly
            className="w-full cursor-default rounded-full border border-border-soft bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400"
          />
        </label>
      </div>
    </header>
  );
}
