import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";

export const getVideoDetails = async (videoId: string, userId: string) => {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { section: true }
  });

  if (!video) throw new AppError("Video not found", 404);

  const allSections = await prisma.section.findMany({
    where: { subject_id: video.section.subject_id },
    orderBy: { order_index: "asc" },
    include: {
      videos: { orderBy: { order_index: "asc" } }
    }
  });

  const flatVideos = allSections.flatMap((s: any) => s.videos);
  const currentIndex = flatVideos.findIndex((v: any) => v.id === video.id);

  if (currentIndex === -1) throw new AppError("Video integrity error", 500);

  let locked = false;
  let unlock_reason = null;

  if (currentIndex > 0) {
    const prevVideo = flatVideos[currentIndex - 1];
    const prevProgress = await prisma.videoProgress.findUnique({
      where: { user_id_video_id: { user_id: userId, video_id: prevVideo.id } }
    });
    if (!prevProgress?.is_completed) {
      locked = true;
      unlock_reason = "Complete the previous video to unlock";
    }
  }

  const previous_video_id = currentIndex > 0 ? flatVideos[currentIndex - 1].id : null;
  const next_video_id = currentIndex < flatVideos.length - 1 ? flatVideos[currentIndex + 1].id : null;

  return {
    id: video.id,
    title: video.title,
    description: video.description,
    youtube_url: video.youtube_url,
    duration_seconds: video.duration_seconds,
    section_id: video.section_id,
    previous_video_id,
    next_video_id,
    locked,
    unlock_reason
  };
};
