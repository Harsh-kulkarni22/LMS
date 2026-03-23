"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectProgress = exports.upsertVideoProgress = exports.getVideoProgress = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const getVideoProgress = async (userId, videoId) => {
    const progress = await db_1.prisma.videoProgress.findUnique({
        where: { user_id_video_id: { user_id: userId, video_id: videoId } }
    });
    return progress || { last_position_seconds: 0, is_completed: false };
};
exports.getVideoProgress = getVideoProgress;
const upsertVideoProgress = async (userId, videoId, position) => {
    const video = await db_1.prisma.video.findUnique({ where: { id: videoId } });
    if (!video)
        throw new AppError_1.AppError("Video not found", 404);
    const last_position_seconds = Math.min(position, video.duration_seconds);
    const is_completed = last_position_seconds >= video.duration_seconds - 5;
    const progress = await db_1.prisma.videoProgress.upsert({
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
exports.upsertVideoProgress = upsertVideoProgress;
const getSubjectProgress = async (userId, subjectId) => {
    const sections = await db_1.prisma.section.findMany({
        where: { subject_id: subjectId },
        include: { videos: true }
    });
    const videoIds = sections.flatMap((s) => s.videos.map((v) => v.id));
    const totalVideos = videoIds.length;
    if (totalVideos === 0)
        return { completed: 0, total: 0, percentage: 0 };
    const completedCount = await db_1.prisma.videoProgress.count({
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
exports.getSubjectProgress = getSubjectProgress;
