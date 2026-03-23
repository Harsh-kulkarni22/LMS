/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import VideoMeta from "@/components/VideoMeta";
import VideoLessonProgress from "@/components/VideoLessonProgress";
import Toast from "@/components/Toast";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { recordSubjectActivity } from "@/lib/subjectActivity";

export default function VideoPage({
  params,
}: {
  params: { subjectId: string; videoId: string };
}) {
  const [videoData, setVideoData] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveSeconds, setLiveSeconds] = useState<number | null>(null);
  const [resumeBaseline, setResumeBaseline] = useState<number | null>(null);
  const [markLoading, setMarkLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [courseProgressPct, setCourseProgressPct] = useState<number | null>(null);
  const router = useRouter();

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vidRes, progRes] = await Promise.all([
          api.get(`/videos/${params.videoId}`),
          api.get(`/progress/videos/${params.videoId}`),
        ]);
        setVideoData(vidRes.data.data);
        setProgress(progRes.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.videoId]);

  useEffect(() => {
    if (progress && resumeBaseline === null && typeof progress.last_position_seconds === "number") {
      setResumeBaseline(progress.last_position_seconds);
    }
  }, [progress, resumeBaseline]);

  useEffect(() => {
    if (
      videoData &&
      !videoData.locked &&
      progress &&
      (progress.last_position_seconds > 0 || progress.is_completed)
    ) {
      recordSubjectActivity(params.subjectId);
    }
  }, [videoData, progress, params.subjectId]);

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/progress/subjects/${params.subjectId}`)
      .then((r) => {
        if (!cancelled) setCourseProgressPct(r.data.data.percentage as number);
      })
      .catch(() => {
        if (!cancelled) setCourseProgressPct(null);
      });
    return () => {
      cancelled = true;
    };
  }, [params.subjectId, progress?.is_completed]);

  const lastSyncRef = useRef<number>(0);
  const handleProgress = useCallback((seconds: number) => {
    setLiveSeconds(seconds);
    const now = Date.now();
    if (now - lastSyncRef.current > 5000) {
      lastSyncRef.current = now;
      api.post(`/progress/videos/${params.videoId}`, {
        last_position_seconds: Math.floor(seconds),
      }).catch(err => console.error("Failed to sync progress:", err));
    }
  }, [params.videoId]);

  const posDisplay = liveSeconds ?? progress?.last_position_seconds ?? 0;

  const lessonProgressPercent = useMemo(() => {
    if (!videoData?.duration_seconds) return 0;
    return Math.min(100, (posDisplay / videoData.duration_seconds) * 100);
  }, [videoData, posDisplay]);

  const markComplete = async () => {
    if (!videoData) return;
    setMarkLoading(true);
    try {
      await api.post(`/progress/videos/${params.videoId}`, {
        last_position_seconds: videoData.duration_seconds,
      });
      const progRes = await api.get(`/progress/videos/${params.videoId}`);
      setProgress(progRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setMarkLoading(false);
    }
  };

  const handleEnded = async () => {
    if (!videoData) return;
    try {
      await api.post(`/progress/videos/${params.videoId}`, {
        last_position_seconds: videoData.duration_seconds,
      });
      const progRes = await api.get(`/progress/videos/${params.videoId}`);
      setProgress(progRes.data.data);

      if (videoData.next_video_id) {
        const nextRes = await api.get(`/videos/${videoData.next_video_id}`);
        const nextTitle = nextRes.data.data.title as string;
        setToast(`Up next: ${nextTitle}`);
        setTimeout(() => {
          router.push(`/subjects/${params.subjectId}/video/${videoData.next_video_id}`);
        }, 2200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!videoData) return null;

  const isCompleted = Boolean(progress?.is_completed);
  const showResume =
    !videoData.locked && !isCompleted && (resumeBaseline ?? 0) > 0 && lessonProgressPercent < 99;

  return (
    <div className="min-h-full bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-10">
      <Toast message={toast} onDismiss={dismissToast} durationMs={4000} />

      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={!videoData.previous_video_id}
            onClick={() =>
              router.push(`/subjects/${params.subjectId}/video/${videoData.previous_video_id}`)
            }
            className="inline-flex items-center text-sm font-semibold text-gray-600 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous lesson
          </button>
          <button
            type="button"
            disabled={!videoData.next_video_id}
            onClick={() =>
              router.push(`/subjects/${params.subjectId}/video/${videoData.next_video_id}`)
            }
            className="inline-flex items-center text-sm font-semibold text-purple-600 transition hover:text-purple-800 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next lesson
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 w-full">
          {!videoData.locked ? (
            <VideoPlayer
              videoId={videoData.id}
              youtubeUrl={videoData.youtube_url}
              initialPosition={progress?.last_position_seconds || 0}
              onEnded={handleEnded}
              onProgress={handleProgress}
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50">
              <span className="text-lg font-semibold uppercase tracking-wide text-red-600">
                Locked
              </span>
              <span className="mt-2 text-sm text-gray-600">
                Please finish previous material to continue.
              </span>
            </div>
          )}

          {!videoData.locked && (
            <>
              <VideoLessonProgress
                lessonProgressPercent={lessonProgressPercent}
                lastPositionSeconds={resumeBaseline ?? 0}
                isCompleted={isCompleted}
                resuming={showResume}
                locked={videoData.locked}
                onMarkComplete={markComplete}
                markCompleteLoading={markLoading}
              />
              {courseProgressPct != null && (
                <p className="mt-3 text-sm text-gray-600">
                  You&apos;ve completed{" "}
                  <span className="font-semibold text-gray-900">{courseProgressPct}%</span> of this
                  course so far.
                </p>
              )}
            </>
          )}

          <VideoMeta
            title={videoData.title}
            description={videoData.description}
            locked={videoData.locked}
            unlockReason={videoData.unlock_reason}
          />
        </div>
      </div>
    </div>
  );
}
