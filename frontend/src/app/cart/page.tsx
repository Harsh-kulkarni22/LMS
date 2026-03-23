"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

function extractYoutubeId(text: string | null): string | null {
  if (!text) return null;
  const match = text.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid hydration mismatch

  const total = items.length * 59.99; // Mocked realistic price

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/home"
            className="mt-4 inline-block font-semibold text-accent hover:text-accent-hover"
          >
            Keep shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <p className="font-semibold text-gray-700">{items.length} Course{items.length !== 1 && 's'} in Cart</p>
            {items.map((course) => {
              const ytId = extractYoutubeId(course.description);
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : `https://picsum.photos/seed/${encodeURIComponent(course.slug || course.id)}/520/292`;
              
              return (
                <div key={course.id} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                  <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded bg-gray-100 sm:h-32 sm:w-56">
                    <Image
                      src={thumb}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col sm:flex-row">
                    <div className="flex-1 pr-4">
                      <Link href={`/subjects/${course.id}`}>
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 hover:text-accent sm:text-lg">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">{course.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
                      <span className="text-lg font-bold text-gray-900">$59.99</span>
                      <button
                        onClick={() => removeFromCart(course.id)}
                        className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 sm:mt-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Total:</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
              <button className="mt-6 w-full rounded bg-accent py-3.5 font-bold text-white transition hover:bg-accent-hover">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
