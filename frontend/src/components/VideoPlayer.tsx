/* eslint-disable @typescript-eslint/no-explicit-any */
import YouTube, { YouTubeEvent } from "react-youtube";
import { useState, useEffect, useRef, memo } from "react";
import { api } from "@/lib/axios";

interface Props {
  videoId: string;
  youtubeUrl: string;
  initialPosition: number;
  onEnded: () => void;
  onProgress: (seconds: number) => void;
}

function VideoPlayer({ videoId, youtubeUrl, initialPosition, onEnded, onProgress }: Props) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastSyncTimeRef = useRef(0);

  // Extract YouTube ID from URL
  const extractYtId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = extractYtId(youtubeUrl);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    if (initialPosition > 0) {
      event.target.seekTo(initialPosition, true);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 0 = ended, 1 = playing, 2 = paused
    if (event.data === 0) {
      setIsPlaying(false);
      onEnded();
    } else if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  // Sync progress every few seconds when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && player) {
      interval = setInterval(async () => {
        const currentTime = Math.floor(player.getCurrentTime());
        onProgress(currentTime);
        
        // Debounce / limit API calls to every 5 seconds
        if (Math.abs(currentTime - lastSyncTimeRef.current) >= 5) {
          lastSyncTimeRef.current = currentTime;
          try {
            await api.post(`/progress/videos/${videoId}`, { last_position_seconds: currentTime });
          } catch {}
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, player, videoId, onProgress]);

  if (!ytId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border-soft bg-black shadow-md">
      <YouTube 
        videoId={ytId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: { autoplay: 1, modestbranding: 1, rel: 0 }
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}

export default memo(VideoPlayer);
