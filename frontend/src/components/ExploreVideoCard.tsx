"use client";

import Image from "next/image";
import Link from "next/link";
export interface ExploreVideo {
  title: string;
  thumbnail: string;
  videoId: string;
  channelTitle: string;
}

function watchHref(video: ExploreVideo) {
  const q = new URLSearchParams({
    title: video.title,
    channel: video.channelTitle,
  });
  return `/home/watch/${video.videoId}?${q.toString()}`;
}

interface Props {
  video: ExploreVideo;
}

export default function ExploreVideoCard({ video }: Props) {
  return (
    <Link
      href={watchHref(video)}
      className="block w-[260px] shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border-soft bg-white shadow-sm transition-all duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="260px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            No thumbnail
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900">
          {video.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-gray-500">{video.channelTitle}</p>
      </div>
    </Link>
  );
}
