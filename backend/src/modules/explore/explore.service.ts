import { env } from "../../config/env";
import { AppError } from "../../utils/AppError";

const SEARCH_QUERIES = [
  "python full course",
  "react course",
  "node js course",
] as const;

export interface ExploreVideoItem {
  title: string;
  thumbnail: string;
  videoId: string;
  channelTitle: string;
}

export interface ExploreSection {
  query: string;
  videos: ExploreVideoItem[];
}

interface YoutubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      default?: { url?: string };
      medium?: { url?: string };
      high?: { url?: string };
    };
  };
}

interface YoutubeSearchResponse {
  items?: YoutubeSearchItem[];
  error?: { message?: string };
}

function mapSearchItem(item: YoutubeSearchItem): ExploreVideoItem | null {
  const videoId = item.id?.videoId;
  if (!videoId) return null;
  const sn = item.snippet;
  const thumbnail =
    sn?.thumbnails?.high?.url ||
    sn?.thumbnails?.medium?.url ||
    sn?.thumbnails?.default?.url ||
    "";
  return {
    title: sn?.title ?? "",
    thumbnail,
    videoId,
    channelTitle: sn?.channelTitle ?? "",
  };
}

export async function getExploreVideos(): Promise<ExploreSection[]> {
  const apiKey = env.YOUTUBE_API_KEY.trim();
  if (!apiKey) {
    throw new AppError("YouTube API key is not configured (set YOUTUBE_API_KEY)", 503);
  }

  const sections = await Promise.all(
    SEARCH_QUERIES.map(async (q) => {
      const url = new URL("https://www.googleapis.com/youtube/v3/search");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("type", "video");
      url.searchParams.set("maxResults", "12");
      url.searchParams.set("q", q);
      url.searchParams.set("key", apiKey);

      const res = await fetch(url.toString());
      const data = (await res.json()) as YoutubeSearchResponse;

      if (!res.ok) {
        const msg = data?.error?.message || res.statusText;
        throw new AppError(`YouTube API error: ${msg}`, 502);
      }

      const videos = (data.items ?? [])
        .map(mapSearchItem)
        .filter((v): v is ExploreVideoItem => v !== null);

      return { query: q, videos };
    })
  );

  return sections;
}
