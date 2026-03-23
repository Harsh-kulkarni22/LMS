"use client";

interface CoursePreviewPopupProps {
  title: string;
  description: string | null;
  learnPoints: string[];
  onAddToCart?: () => void;
}

export default function CoursePreviewPopup({
  title,
  description,
  learnPoints,
  onAddToCart,
}: CoursePreviewPopupProps) {
  return (
    <div className="w-[min(100vw-2rem,22rem)] rounded-lg border border-border-soft bg-white p-4 shadow-xl">
      <h3 className="text-base font-semibold leading-snug text-gray-900">{title}</h3>
      <p className="mt-2 line-clamp-4 text-sm text-gray-700">
        {description || "A comprehensive course designed to help you build real skills step by step."}
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
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAddToCart?.();
        }}
        className="mt-4 w-full rounded bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
      >
        Add to cart
      </button>
    </div>
  );
}
