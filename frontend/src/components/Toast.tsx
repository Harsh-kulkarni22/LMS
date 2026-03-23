"use client";

import { useEffect } from "react";
import { clsx } from "clsx";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  durationMs?: number;
}

export default function Toast({ message, onDismiss, durationMs = 4200 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [message, onDismiss, durationMs]);

  if (!message) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-6 left-1/2 z-[100] max-w-md -translate-x-1/2 rounded-lg px-5 py-3",
        "border border-white/10 bg-gray-900 text-sm font-medium text-white shadow-xl transition-opacity duration-300"
      )}
      role="status"
    >
      {message}
    </div>
  );
}
