"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import YoutubePlayerEmbed from "@/components/YoutubePlayerEmbed";

function WatchContent({ videoId }: { videoId: string }) {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Video";
  const channel = searchParams.get("channel") || "";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="mb-6 inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to explore
      </Link>

      <YoutubePlayerEmbed youtubeVideoId={videoId} />

      <div className="mt-6 rounded-lg border border-border-soft bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{title}</h1>
        {channel && <p className="mt-2 text-gray-600">{channel}</p>}
      </div>
    </div>
  );
}

export default function ExploreWatchPage({ params }: { params: { videoId: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center">
            <span className="text-gray-500">Loading…</span>
          </div>
        }
      >
        <WatchContent videoId={params.videoId} />
      </Suspense>
    </div>
  );
}
