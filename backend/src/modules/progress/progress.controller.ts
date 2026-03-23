import { Request, Response, NextFunction } from "express";
import * as progressService from "./progress.service";

export const getVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const progress = await progressService.getVideoProgress(req.user.userId, req.params.videoId as string);
    res.status(200).json({ success: true, data: progress });
  } catch (error) { next(error); }
};

export const updateVideoProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const position = parseInt(req.body.last_position_seconds, 10) || 0;
    const progress = await progressService.upsertVideoProgress(req.user.userId, req.params.videoId as string, position);
    res.status(200).json({ success: true, data: progress });
  } catch (error) { next(error); }
};

export const getSubjectProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const progress = await progressService.getSubjectProgress(req.user.userId, req.params.subjectId as string);
    res.status(200).json({ success: true, data: progress });
  } catch (error) { next(error); }
};
