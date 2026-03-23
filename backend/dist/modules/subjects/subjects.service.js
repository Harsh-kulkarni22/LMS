"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubjectTree = exports.getSubjectById = exports.getAllPublishedSubjects = void 0;
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const getAllPublishedSubjects = async () => {
    return await db_1.prisma.subject.findMany({
        where: { is_published: true },
        select: { id: true, title: true, slug: true, description: true }
    });
};
exports.getAllPublishedSubjects = getAllPublishedSubjects;
const getSubjectById = async (id) => {
    const subject = await db_1.prisma.subject.findUnique({
        where: { id, is_published: true },
    });
    if (!subject)
        throw new AppError_1.AppError("Subject not found", 404);
    return subject;
};
exports.getSubjectById = getSubjectById;
const getSubjectTree = async (subjectId, userId) => {
    const subject = await db_1.prisma.subject.findUnique({
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
    if (!subject)
        throw new AppError_1.AppError("Subject not found", 404);
    const progressList = await db_1.prisma.videoProgress.findMany({
        where: { user_id: userId, video: { section: { subject_id: subjectId } } }
    });
    const progressMap = new Map(progressList.map((p) => [p.video_id, p]));
    let previousCompleted = true; // First video is unlocked implicitly
    const enrichedSections = subject.sections.map((section) => {
        const enrichedVideos = section.videos.map((video) => {
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
exports.getSubjectTree = getSubjectTree;
