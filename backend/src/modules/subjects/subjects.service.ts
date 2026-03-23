import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";

export const getAllPublishedSubjects = async () => {
  return await prisma.subject.findMany({
    where: { is_published: true },
    select: { id: true, title: true, slug: true, description: true }
  });
};

export const getSubjectById = async (id: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id, is_published: true },
  });
  if (!subject) throw new AppError("Subject not found", 404);
  return subject;
};

export const getSubjectTree = async (subjectId: string, userId: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sections: {
        orderBy: { order_index: "asc" },
        include: {
          videos: {
            orderBy: { order_index: "asc" },
            select: { id: true, title: true, duration_seconds: true }
          }
        }
      }
    }
  });

  if (!subject) throw new AppError("Subject not found", 404);

  const progressList = await prisma.videoProgress.findMany({
    where: { user_id: userId, video: { section: { subject_id: subjectId } } }
  });
  const progressMap = new Map<string, any>(progressList.map((p: any) => [p.video_id, p]));

  let previousCompleted = true; // First video is unlocked implicitly

  const enrichedSections = subject.sections.map((section: any) => {
    const enrichedVideos = section.videos.map((video: any) => {
      const progress = progressMap.get(video.id);
      const is_completed = progress?.is_completed || false;
      const locked = !previousCompleted;
      
      previousCompleted = is_completed;

      return { ...video, is_completed, locked };
    });
    return { id: section.id, title: section.title, videos: enrichedVideos };
  });

  return { id: subject.id, title: subject.title, sections: enrichedSections };
};
