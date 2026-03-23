"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Star, Heart } from "lucide-react";
import CoursePreviewPopup from "./CoursePreviewPopup";
import ProgressBar from "./ProgressBar";
import { useWishlistStore } from "@/store/wishlistStore";
import { clsx } from "clsx";

export interface CourseCardSubject {
  id: string;
  title: string;
  description: string;
  slug: string;
}

function deriveLearnPoints(description: string | null): string[] {
  if (!description?.trim()) {
    return ["Structured video lessons", "Progress tracking", "Sequential unlocking"];
  }
  const parts = description
    .split(/[.!?\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
  return parts.length
    ? parts
    : ["Learn core concepts", "Apply what you learn", "Build real skills"];
}

function extractYoutubeId(text: string | null): string | null {
  if (!text) return null;
  const match = text.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

function getFallbackThumbnail(id: string): string {
  const fallbacks = [
    "https://i.ytimg.com/vi/Sklc_fQBmcs/0.jpg",
    "https://i.ytimg.com/vi/_GTMOnL1M9U/0.jpg",
    "https://i.ytimg.com/vi/Zi-Q0t4gMC8/0.jpg",
    "https://i.ytimg.com/vi/Zq5fmkH0T78/0.jpg",
    "https://i.ytimg.com/vi/bMknfKXIFA8/0.jpg",
    "https://i.ytimg.com/vi/8aGhZQkoFbQ/0.jpg",
    "https://i.ytimg.com/vi/W6NZfCO5SIk/0.jpg",
    "https://i.ytimg.com/vi/mU6anWqZJcc/0.jpg",
    "https://i.ytimg.com/vi/xk4_1vDrzzo/0.jpg",
    "https://i.ytimg.com/vi/pTNhAjvw6XY/0.jpg"
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  return fallbacks[h % fallbacks.length];
}

function seededMeta(id: string) {
  const instructors = ["Alex Morgan", "Jordan Lee", "Sam Rivera", "Casey Kim"];
  const ratings = [4.6, 4.7, 4.8, 4.5];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 997;
  return {
    instructor: instructors[h % instructors.length],
    rating: ratings[h % ratings.length],
    price: h % 2 === 0 ? "$49.99" : "$59.99",
    badge: (h % 5 === 0 ? "bestseller" : h % 5 === 1 ? "premium" : null) as
      | "bestseller"
      | "premium"
      | null,
  };
}

interface CourseCardProps {
  subject: CourseCardSubject;
  /** Course-level % from GET /api/progress/subjects/:subjectId */
  courseProgressPercent?: number;
  /** Show progress row even at 0% (e.g. My Learning / continue) */
  alwaysShowProgress?: boolean;
  thumbnailUrl?: string | null;
}

export default function CourseCard({
  subject,
  courseProgressPercent,
  alwaysShowProgress,
  thumbnailUrl,
}: CourseCardProps) {
  const { instructor, rating, price, badge } = seededMeta(subject.id);
  const learnPoints = deriveLearnPoints(subject.description);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(subject.id);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHide = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHide = () => {
    clearHide();
    hideTimerRef.current = setTimeout(() => setShowPreview(false), 180);
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => () => clearHide(), []);

  const updatePosition = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const popupWidth = 352;
    const margin = 8;
    let left = r.right + margin;
    if (left + popupWidth > window.innerWidth - margin) {
      left = r.left - popupWidth - margin;
    }
    if (left < margin) left = margin;
    let top = r.top;
    const estHeight = 320;
    if (top + estHeight > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - estHeight - margin);
    }
    setPos({ top, left });
  }, []);

  useEffect(() => {
    if (!showPreview) return;
    updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [showPreview, updatePosition]);

  const ytId = extractYoutubeId(subject.description);
  const thumb =
    thumbnailUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/0.jpg` : getFallbackThumbnail(subject.id));

  return (
    <div
      ref={wrapRef}
      className="group relative w-[260px] shrink-0"
      onMouseEnter={() => {
        clearHide();
        updatePosition();
        setShowPreview(true);
      }}
      onMouseLeave={scheduleHide}
    >
      <Link
        href={`/subjects/${subject.id}`}
        className="block cursor-pointer overflow-hidden rounded-lg border border-border-soft bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={thumb}
            alt=""
            fill
            sizes="260px"
            className="object-cover"
            loading="lazy"
          />
          {badge && (
            <span
              className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-bold uppercase text-white ${
                badge === "bestseller" ? "bg-[#eceb98] text-gray-900" : "bg-gray-900"
              }`}
            >
              {badge === "bestseller" ? "Bestseller" : "Premium"}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(subject);
            }}
            className="absolute right-2 top-2 z-10 rounded-full p-1.5 backdrop-blur-md bg-white/30 transition-colors hover:bg-white/50"
          >
            <Heart
              className={clsx("h-5 w-5 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "text-white")}
            />
          </button>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900">
            {subject.title}
          </h3>
          <p className="mt-1 truncate text-xs text-gray-500">{instructor}</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm font-semibold text-amber-700">{rating.toFixed(1)}</span>
            <div className="flex text-amber-500" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 shrink-0 ${
                    i <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-none text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-2 text-base font-semibold text-gray-900">{price}</p>
          {courseProgressPercent != null &&
            (alwaysShowProgress || courseProgressPercent > 0) && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-purple-700">Continue learning</span>
                  <span className="text-xs font-medium text-gray-500">
                    {Math.round(courseProgressPercent)}%
                  </span>
                </div>
                <ProgressBar progress={courseProgressPercent} />
              </div>
            )}
        </div>
      </Link>

      {mounted &&
        showPreview &&
        createPortal(
          <div
            className="fixed z-[60] hidden md:block"
            style={{ top: pos.top, left: pos.left }}
            onMouseEnter={clearHide}
            onMouseLeave={scheduleHide}
          >
            <div className="shadow-xl">
              <CoursePreviewPopup
                course={subject}
                learnPoints={learnPoints}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
