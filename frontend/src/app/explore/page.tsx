"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Loader2, ArrowLeft } from "lucide-react";
import ExploreVideoCard, { type ExploreVideo } from "@/components/ExploreVideoCard";

interface ExploreSection {
  query: string;
  videos: ExploreVideo[];
}

export default function ExplorePage() {
  const [sections, setSections] = useState<ExploreSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/explore");
        if (!cancelled) setSections(res.data.data as ExploreSection[]);
      } catch (e: unknown) {
        const ax = e as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };
        const msg =
          ax.response?.data?.message ||
          ax.message ||
          (ax.response?.status === 404
            ? "Explore API not found — rebuild the backend (npm run build) and restart."
            : "Could not load explore content.");
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border-soft pb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Explore on YouTube</h1>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
            <p className="font-medium">{error}</p>
            {/not configured|YOUTUBE_API_KEY/i.test(error) && (
              <p className="mt-2 text-sm text-amber-800">
                Add <code className="rounded bg-amber-100 px-1">YOUTUBE_API_KEY</code> to the backend{" "}
                <code className="rounded bg-amber-100 px-1">.env</code>, run{" "}
                <code className="rounded bg-amber-100 px-1">npm run build</code> in the backend folder, then
                restart the server.
              </p>
            )}
            {/rebuild the backend/i.test(error) && (
              <p className="mt-2 text-sm text-amber-800">
                From <code className="rounded bg-amber-100 px-1">backend/</code> run{" "}
                <code className="rounded bg-amber-100 px-1">npm run build</code>, then start the server again.
              </p>
            )}
          </div>
        )}

        {!loading &&
          !error &&
          sections.map((section) => (
            <section key={section.query} className="mt-12 first:mt-0">
              <h2 className="text-xl font-semibold capitalize text-gray-900 sm:text-2xl">
                {section.query}
              </h2>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {section.videos.map((v) => (
                  <ExploreVideoCard key={`${section.query}-${v.videoId}`} video={v} />
                ))}
              </div>
              {section.videos.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">No videos found for this search.</p>
              )}
            </section>
          ))}
      </div>
    </div>
  );
}
