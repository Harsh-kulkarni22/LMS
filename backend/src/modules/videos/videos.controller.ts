import { Request, Response, NextFunction } from "express";
import * as videosService from "./videos.service";

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    const videoData = await videosService.getVideoDetails(req.params.id as string, req.user.userId);
    res.status(200).json({ success: true, data: videoData });
  } catch (error) { next(error); }
};
