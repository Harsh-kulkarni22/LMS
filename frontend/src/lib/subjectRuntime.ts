"use client";

import { api } from "@/lib/axios";

interface SubjectTreeVideo {
  id: string;
}

interface SubjectTreeSection {
  videos: SubjectTreeVideo[];
}

interface SubjectRuntime {
  progressPercent: number;
  hasWatched: boolean;
  lastWatchedAt: number;
  thumbnailUrl: string | null;
}

function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function toYoutubeThumb(youtubeUrl: string): string | null {
  const id = extractYoutubeId(youtubeUrl);
  return id ? `https://i.ytimg.com/vi/${id}/0.jpg` : null;
}

export async function fetchSubjectRuntime(subjectId: string): Promise<SubjectRuntime> {
  const [subjectProgressRes, treeRes] = await Promise.all([
    api.get(`/progress/subjects/${subjectId}`).catch(() => ({ data: { data: { percentage: 0 } } })),
    api.get(`/subjects/${subjectId}/tree`),
  ]);

  const sections = (treeRes.data.data.sections || []) as SubjectTreeSection[];
  const videoIds = sections.flatMap((s) => (s.videos || []).map((v) => v.id));

  let thumbnailUrl: string | null = null;
  if (videoIds.length > 0) {
    try {
      const firstVideo = await api.get(`/videos/${videoIds[0]}`);
      thumbnailUrl = toYoutubeThumb(firstVideo.data.data.youtube_url) || null;
    } catch {
      thumbnailUrl = null;
    }
  }

  const progressResults = await Promise.allSettled(
    videoIds.map((videoId) => api.get(`/progress/videos/${videoId}`))
  );

  let hasWatched = false;
  let lastWatchedAt = 0;

  for (const item of progressResults) {
    if (item.status !== "fulfilled") continue;
    const data = item.value.data?.data;
    if (!data) continue;
    const seen = Boolean(data.is_completed) || Number(data.last_position_seconds || 0) > 0;
    if (!seen) continue;
    hasWatched = true;
    const ts = data.updated_at ? new Date(data.updated_at).getTime() : 0;
    if (ts > lastWatchedAt) lastWatchedAt = ts;
  }

  const completionPct = Number(subjectProgressRes.data?.data?.percentage || 0);
  const progressPercent = hasWatched ? Math.max(1, completionPct) : completionPct;

  return {
    progressPercent,
    hasWatched,
    lastWatchedAt,
    thumbnailUrl,
  };
}
