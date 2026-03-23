"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Wishlist</h1>
      
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Your wishlist is empty.</p>
          <Link
            href="/home"
            className="mt-4 inline-block font-semibold text-accent hover:text-accent-hover"
          >
            Explore courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((course) => (
            <CourseCard key={course.id} subject={course} />
          ))}
        </div>
      )}
    </div>
  );
}
