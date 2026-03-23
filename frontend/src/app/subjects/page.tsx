"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { fetchSubjectRuntime } from "@/lib/subjectRuntime";

interface Subject {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string | null>>({});
  const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({});
  const [lastWatchedMap, setLastWatchedMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        const subs = res.data.data as Subject[];
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const myLearning = useMemo(() => {
    const started = subjects.filter((s) => watchedMap[s.id]);
    return [...started].sort((a, b) => (lastWatchedMap[b.id] || 0) - (lastWatchedMap[a.id] || 0));
  }, [subjects, watchedMap, lastWatchedMap]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mt-4 border-b border-border-soft pb-8">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">My learning</h1>
          <p className="mt-2 text-gray-600">
            Courses you&apos;ve started—sorted with the most recently watched first.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 sm:justify-items-stretch md:grid-cols-3 lg:grid-cols-4">
          {myLearning.map((subject) => (
            <div
              key={subject.id}
              className="flex w-full max-w-[260px] justify-center sm:max-w-none sm:justify-start"
            >
              <CourseCard
                subject={subject}
                courseProgressPercent={progressMap[subject.id] ?? 0}
                thumbnailUrl={thumbnailMap[subject.id]}
                alwaysShowProgress
              />
            </div>
          ))}
        </div>
        {myLearning.length === 0 && (
          <p className="mt-12 text-center text-gray-500">
            No courses in progress yet. Open a course and watch a lesson to see it here.
          </p>
        )}
      </div>
    </div>
  );
}
