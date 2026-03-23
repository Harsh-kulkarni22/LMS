"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExploreVideos = getExploreVideos;
const env_1 = require("../../config/env");
const AppError_1 = require("../../utils/AppError");
const SEARCH_QUERIES = [
    "python full course",
    "react course",
    "node js course",
];
function mapSearchItem(item) {
    const videoId = item.id?.videoId;
    if (!videoId)
        return null;
    const sn = item.snippet;
    const thumbnail = sn?.thumbnails?.high?.url ||
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
async function getExploreVideos() {
    const apiKey = env_1.env.YOUTUBE_API_KEY.trim();
    if (!apiKey) {
        throw new AppError_1.AppError("YouTube API key is not configured (set YOUTUBE_API_KEY)", 503);
    }
    const sections = await Promise.all(SEARCH_QUERIES.map(async (q) => {
        const url = new URL("https://www.googleapis.com/youtube/v3/search");
        url.searchParams.set("part", "snippet");
        url.searchParams.set("type", "video");
        url.searchParams.set("maxResults", "12");
        url.searchParams.set("q", q);
        url.searchParams.set("key", apiKey);
        const res = await fetch(url.toString());
        const data = (await res.json());
        if (!res.ok) {
            const msg = data?.error?.message || res.statusText;
            throw new AppError_1.AppError(`YouTube API error: ${msg}`, 502);
        }
        const videos = (data.items ?? [])
            .map(mapSearchItem)
            .filter((v) => v !== null);
        return { query: q, videos };
    }));
    return sections;
}
