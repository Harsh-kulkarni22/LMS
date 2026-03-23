"use client";

import YouTube from "react-youtube";

interface Props {
  youtubeVideoId: string;
}

export default function YoutubePlayerEmbed({ youtubeVideoId }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border-soft bg-black shadow-md">
      <div className="absolute inset-0">
        <YouTube
          videoId={youtubeVideoId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: { modestbranding: 1, rel: 0 },
          }}
          className="h-full w-full"
          iframeClassName="h-full w-full"
        />
      </div>
    </div>
  );
}
