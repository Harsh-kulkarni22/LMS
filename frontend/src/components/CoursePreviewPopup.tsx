"use client";

import { Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CourseCardSubject } from "@/components/CourseCard";
import { clsx } from "clsx";

interface CoursePreviewPopupProps {
  course: CourseCardSubject;
  learnPoints: string[];
}

export default function CoursePreviewPopup({
  course,
  learnPoints,
}: CoursePreviewPopupProps) {
  const { addToCart, items: cartItems } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const inCart = cartItems.some((item) => item.id === course.id);
  const inWishlist = isInWishlist(course.id);
  return (
    <div className="w-[min(100vw-2rem,22rem)] animate-in fade-in slide-in-from-bottom-2 duration-200 rounded-lg border border-border-soft bg-white p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-gray-900">{course.title}</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(course);
          }}
          className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-gray-100"
        >
          <Heart
            className={clsx("h-5 w-5 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500")}
          />
        </button>
      </div>
      <p className="mt-2 line-clamp-4 text-sm text-gray-700">
        {course.description || "A comprehensive course designed to help you build real skills step by step."}
      </p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          What you&apos;ll learn
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
          {learnPoints.slice(0, 4).map((point, i) => (
            <li key={i} className="leading-snug">
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!inCart) addToCart(course);
          }}
          disabled={inCart}
          className="flex-1 rounded bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {inCart ? "In cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
