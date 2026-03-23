import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";

export const getVideoProgress = async (userId: string, videoId: string) => {
  const progress = await prisma.videoProgress.findUnique({
    where: { user_id_video_id: { user_id: userId, video_id: videoId } }
  });
  return progress || { last_position_seconds: 0, is_completed: false };
};

export const upsertVideoProgress = async (userId: string, videoId: string, position: number) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) throw new AppError("Video not found", 404);

  const last_position_seconds = Math.min(position, video.duration_seconds);
  const is_completed = last_position_seconds >= video.duration_seconds - 5; 

  const progress = await prisma.videoProgress.upsert({
    where: { user_id_video_id: { user_id: userId, video_id: videoId } },
    update: {
      last_position_seconds,
      is_completed: is_completed ? true : undefined,
      completed_at: is_completed ? new Date() : undefined
    },
    create: {
      user_id: userId,
      video_id: videoId,
      last_position_seconds,
      is_completed,
      completed_at: is_completed ? new Date() : null
    }
  });

  return progress;
};

export const getSubjectProgress = async (userId: string, subjectId: string) => {
  const sections = await prisma.section.findMany({
    where: { subject_id: subjectId },
    include: { videos: true }
  });
  
  const videoIds = sections.flatMap((s: any) => s.videos.map((v: any) => v.id));
  const totalVideos = videoIds.length;

  if (totalVideos === 0) return { completed: 0, total: 0, percentage: 0 };

  const completedCount = await prisma.videoProgress.count({
    where: {
      user_id: userId,
      video_id: { in: videoIds },
      is_completed: true
    }
  });

  return {
    completed: completedCount,
    total: totalVideos,
    percentage: Math.round((completedCount / totalVideos) * 100)
  };
};
