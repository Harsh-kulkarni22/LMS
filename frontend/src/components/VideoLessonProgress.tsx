"use client";

import { CheckCircle2, Play } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { formatTimestamp } from "@/lib/formatTime";

interface Props {
  lessonProgressPercent: number;
  lastPositionSeconds: number;
  isCompleted: boolean;
  resuming: boolean;
  locked: boolean;
  onMarkComplete: () => void;
  markCompleteLoading?: boolean;
}

export default function VideoLessonProgress({
  lessonProgressPercent,
  lastPositionSeconds,
  isCompleted,
  resuming,
  locked,
  onMarkComplete,
  markCompleteLoading,
}: Props) {
  if (locked) return null;

  const pct = Math.round(Math.min(100, Math.max(0, lessonProgressPercent)));
  const showResume =
    resuming && lastPositionSeconds > 0 && !isCompleted && pct < 99;
  const showMarkManual = !isCompleted && pct < 95;

  return (
    <div className="mt-4 rounded-lg border border-border-soft bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-900">
          {isCompleted ? (
            <span className="inline-flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Lesson completed
            </span>
          ) : (
            <>You&apos;ve completed {pct}% of this lesson</>
          )}
        </p>
        {isCompleted && (
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            Completed
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <ProgressBar progress={lessonProgressPercent} />
      </div>

      {showResume && (
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-gray-700">
          <Play className="h-4 w-4 shrink-0 text-purple-600" aria-hidden />
          <span>
            Resuming from <span className="font-semibold text-gray-900">{formatTimestamp(lastPositionSeconds)}</span>
          </span>
        </p>
      )}

      {showMarkManual && (
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={markCompleteLoading}
          className="mt-4 w-full rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-900 transition hover:bg-purple-100 disabled:opacity-50 sm:w-auto"
        >
          {markCompleteLoading ? "Saving…" : "Mark as completed"}
        </button>
      )}
    </div>
  );
}
