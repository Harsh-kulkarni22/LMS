"use client";

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";

function WatchContent({ videoId }: { videoId: string }) {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Explore Video";
  const channel = searchParams.get("channel") || "YouTube Channel";
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/home"
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="aspect-video w-full bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-lg font-medium text-gray-600">{channel}</p>
        </div>
      </div>
    </div>
  );
}

export default function WatchExploreVideo({ params }: { params: { videoId: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex justify-center py-24"><Loader2 className="h-10 w-10 animate-spin text-purple-600" /></div>}>
      <WatchContent videoId={params.videoId} />
    </Suspense>
  );
}
