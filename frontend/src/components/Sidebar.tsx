"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useSidebarStore } from "@/store/sidebarStore";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Lock, PlayCircle, CheckCircle, ChevronLeft, Menu } from "lucide-react";
import Link from "next/link";
import ProgressBar from "./ProgressBar";

interface VideoNode {
  id: string;
  title: string;
  duration_seconds: number;
  is_completed: boolean;
  locked: boolean;
}

interface SectionNode {
  id: string;
  title: string;
  videos: VideoNode[];
}

interface TreeData {
  id: string;
  title: string;
  sections: SectionNode[];
}

export default function Sidebar({ subjectId }: { subjectId: string }) {
  const { isOpen, toggle } = useSidebarStore();
  const [tree, setTree] = useState<TreeData | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const [treeRes, progRes] = await Promise.all([
          api.get(`/subjects/${subjectId}/tree`),
          api.get(`/progress/subjects/${subjectId}`),
        ]);
        setTree(treeRes.data.data);
        setProgress(progRes.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTree();
  }, [subjectId, pathname]);

  if (!isOpen) {
    return (
      <div className="relative z-20 flex h-full w-16 shrink-0 flex-col items-center border-l border-border-soft bg-white py-4 transition-all duration-300">
        <button
          type="button"
          onClick={toggle}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
          aria-label="Open course content"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-20 flex h-full w-80 shrink-0 flex-col border-l border-border-soft bg-white transition-all duration-300">
      <div className="border-b border-border-soft p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/subjects"
            className="flex items-center text-sm font-semibold text-gray-600 transition-colors hover:text-accent"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Collapse sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <h2 className="mb-4 line-clamp-2 text-lg font-semibold text-gray-900">
          {tree?.title || "Loading..."}
        </h2>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-gray-500">
            <span>Course progress</span>
            <span>{progress.percentage}%</span>
          </div>
          <ProgressBar percentage={progress.percentage} />
          <div className="text-right text-xs text-gray-500">
            {progress.completed} / {progress.total} lessons
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto p-4">
        {tree?.sections.map((section, idx) => (
          <div key={section.id}>
            <h3 className="mb-3 ml-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Section {idx + 1}
              {section.title ? `: ${section.title}` : ""}
            </h3>
            <div className="space-y-1">
              {section.videos.map((video) => {
                const isActive = pathname.includes(`/video/${video.id}`);
                return (
                  <button
                    key={video.id}
                    type="button"
                    disabled={video.locked}
                    onClick={() => router.push(`/subjects/${subjectId}/video/${video.id}`)}
                    className={clsx(
                      "flex w-full items-start rounded-lg border p-3 text-left transition-all duration-200",
                      isActive
                        ? "border-accent/40 bg-purple-50 shadow-sm"
                        : "border-transparent hover:bg-gray-50",
                      video.locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    )}
                  >
                    <div className="mr-3 mt-0.5 shrink-0">
                      {video.locked ? (
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden />
                      ) : video.is_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" aria-hidden />
                      ) : (
                        <PlayCircle
                          className={clsx(
                            "h-5 w-5",
                            isActive ? "text-accent" : "text-gray-400"
                          )}
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={clsx(
                          "text-sm leading-snug",
                          isActive ? "font-semibold text-gray-900" : "text-gray-700"
                        )}
                      >
                        {video.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {Math.floor(video.duration_seconds / 60)}:
                        {(video.duration_seconds % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
