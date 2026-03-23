"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import CourseRow from "@/components/CourseRow";
import type { CourseCardSubject } from "@/components/CourseCard";
import { fetchSubjectRuntime } from "@/lib/subjectRuntime";

interface Subject {
  id: string;
  title: string;
  description: string;
  slug: string;
}

function rotate<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return [];
  const k = n % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}

export default function LandingPage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [subjects, setSubjects] = useState<CourseCardSubject[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string | null>>({});
  const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({});
  const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setProgressMap({});
      setThumbnailMap({});
      setWatchedMap({});
      setLastWatchedMap({});
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get("/subjects");
        const subs = res.data.data as Subject[];
        if (cancelled) return;
        setSubjects(subs);

        const runtimeEntries = await Promise.all(
          subs.map(async (s) => {
            try {
              const runtime = await fetchSubjectRuntime(s.id);
              return [s.id, runtime] as const;
            } catch {
              return [
                s.id,
                {
                  progressPercent: 0,
                  hasWatched: false,
                  lastWatchedAt: 0,
                  thumbnailUrl: null,
                },
              ] as const;
            }
          })
        );

        if (!cancelled) {
          setProgressMap(
            Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.progressPercent]))
          );
          setThumbnailMap(
            Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.thumbnailUrl]))
          );
          setWatchedMap(
            Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.hasWatched]))
          );
          setLastWatchedMap(
            Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.lastWatchedAt]))
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const continueSubjects = useMemo(() => {
    if (!user || subjects.length === 0) return [];
    const started = subjects.filter((s) => watchedMap[s.id]);
    return [...started].sort((a, b) => (lastWatchedMap[b.id] || 0) - (lastWatchedMap[a.id] || 0));
  }, [user, subjects, watchedMap, lastWatchedMap]);

  const continueIds = useMemo(() => new Set(continueSubjects.map((s) => s.id)), [continueSubjects]);

  const restPool = useMemo(
    () => subjects.filter((s) => !continueIds.has(s.id)),
    [subjects, continueIds]
  );

  const s = restPool.length > 0 ? restPool : subjects;
  const aiFiltered = s.filter(
    (x) =>
      /ai|machine learning|data|python|neural/i.test(x.title + " " + x.description)
  );
  const topAi = aiFiltered.length >= 2 ? aiFiltered : s;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <HeroBanner />

        {!user && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
            >
              Get started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>
        )}

        {user && loading && (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          </div>
        )}

        {user && !loading && subjects.length > 0 && (
          <>
            {continueSubjects.length > 0 && (
              <CourseRow
                title="Continue learning"
                subjects={continueSubjects}
                progressBySubjectId={progressMap}
                thumbnailBySubjectId={thumbnailMap}
                alwaysShowProgress
              />
            )}
            <CourseRow
              title="What to learn next"
              subjects={s.slice(0, Math.min(8, s.length))}
              progressBySubjectId={progressMap}
              thumbnailBySubjectId={thumbnailMap}
            />
            <CourseRow
              title="Recommended for you"
              subjects={rotate(s, 1).slice(0, Math.min(8, s.length))}
              progressBySubjectId={progressMap}
              thumbnailBySubjectId={thumbnailMap}
            />
            <CourseRow
              title="Trending courses"
              subjects={rotate(s, 2).slice(0, Math.min(8, s.length))}
              progressBySubjectId={progressMap}
              thumbnailBySubjectId={thumbnailMap}
            />
            <CourseRow
              title="Top courses in AI"
              subjects={topAi.slice(0, Math.min(8, topAi.length))}
              progressBySubjectId={progressMap}
              thumbnailBySubjectId={thumbnailMap}
            />
          </>
        )}

        {user && !loading && subjects.length === 0 && (
          <p className="mt-12 text-center text-gray-500">
            No published courses yet. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
