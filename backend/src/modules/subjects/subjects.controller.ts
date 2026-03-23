import { Request, Response, NextFunction } from "express";
import * as subjectsService from "./subjects.service";

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subjects = await subjectsService.getAllPublishedSubjects();
    res.status(200).json({ success: true, data: subjects });
  } catch (error) { next(error); }
};

export const getSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subject = await subjectsService.getSubjectById(req.params.id as string);
    res.status(200).json({ success: true, data: subject });
  } catch (error) { next(error); }
};

export const getTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is populated by requireAuth middleware
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const tree = await subjectsService.getSubjectTree(req.params.id as string, req.user.userId);
    res.status(200).json({ success: true, data: tree });
  } catch (error) { next(error); }
};
