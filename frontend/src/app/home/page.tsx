"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";
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

function HomeContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const [mounted, setMounted] = useState(false);
  
  // LMS State
  const [subjects, setSubjects] = useState<CourseCardSubject[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string | null>>({});
  const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({});
  const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>({});
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let cancelled = false;
    
    const loadAllData = async () => {
      setLoading(true);
      
      try {
        // Fetch Subjects First
        const subjectRes = await api.get("/subjects").catch(() => ({ data: { data: [] } }));
        const subs = subjectRes.data.data as Subject[];
        
        if (!cancelled) {
          setSubjects(subs);
        }

        // Fetch Run times concurrently
        const runtimePromise = Promise.all(
          subs.map(async (s) => {
            try {
              const runtime = await fetchSubjectRuntime(s.id);
              return [s.id, runtime] as const;
            } catch {
              return [
                s.id,
                { progressPercent: 0, hasWatched: false, lastWatchedAt: 0, thumbnailUrl: null },
              ] as const;
            }
          })
        );

        const runtimeEntries = await runtimePromise;

        if (!cancelled) {
          setProgressMap(Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.progressPercent])));
          setThumbnailMap(Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.thumbnailUrl])));
          setWatchedMap(Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.hasWatched])));
          setLastWatchedMap(Object.fromEntries(runtimeEntries.map(([id, r]) => [id, r.lastWatchedAt])));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (user || !user) {
      loadAllData();
    }
    
    return () => {
      cancelled = true;
    };
  }, [user, q]);

  const continueSubjects = useMemo(() => {
    if (subjects.length === 0) return [];
    const started = subjects.filter((s) => watchedMap[s.id]);
    return [...started].sort((a, b) => (lastWatchedMap[b.id] || 0) - (lastWatchedMap[a.id] || 0));
  }, [subjects, watchedMap, lastWatchedMap]);

  const continueIds = useMemo(() => new Set(continueSubjects.map((s) => s.id)), [continueSubjects]);
  const restPool = useMemo(() => subjects.filter((s) => !continueIds.has(s.id)), [subjects, continueIds]);
  const s = restPool.length > 0 ? restPool : subjects;
  const aiFiltered = s.filter((x) => /ai|machine learning|data|python|neural/i.test(x.title + " " + x.description));
  const topAi = aiFiltered.length >= 2 ? aiFiltered : s;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 px-4 py-12 shadow-md sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : "!"}
          </h1>
          <p className="max-w-xl text-lg text-purple-200">
            Pick up right where you left off. Here is what&apos;s happening with your courses and explore recommendations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="mt-16 flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
          </div>
        )}

        {!loading && (
          <div className="space-y-16">
            {/* LMS CONTENT */}
            {subjects.length > 0 ? (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8 space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Your Learning Journey</h2>
                </div>
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
                  title="Trending courses"
                  subjects={rotate(s, 2).slice(0, Math.min(8, s.length))}
                  progressBySubjectId={progressMap}
                  thumbnailBySubjectId={thumbnailMap}
                />
                <CourseRow
                  title="Top courses in AI"
                  subjects={topAi.slice(0, 8)}
                  progressBySubjectId={progressMap}
                  thumbnailBySubjectId={thumbnailMap}
                />
                <CourseRow
                  title="Top courses in Python"
                  subjects={Array.from(new Set([...s.filter(x => /python/i.test(x.title + " " + x.description)), ...s])).slice(0, 8)}
                  progressBySubjectId={progressMap}
                  thumbnailBySubjectId={thumbnailMap}
                />
                <CourseRow
                  title="Top courses in React"
                  subjects={Array.from(new Set([...s.filter(x => /react/i.test(x.title + " " + x.description)), ...s])).slice(0, 8)}
                  progressBySubjectId={progressMap}
                  thumbnailBySubjectId={thumbnailMap}
                />
                <CourseRow
                  title="Top courses in Node.js"
                  subjects={Array.from(new Set([...s.filter(x => /node|express/i.test(x.title + " " + x.description)), ...s])).slice(0, 8)}
                  progressBySubjectId={progressMap}
                  thumbnailBySubjectId={thumbnailMap}
                />
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin text-purple-600" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
