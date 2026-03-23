import { Request, Response, NextFunction } from "express";
import * as exploreService from "./explore.service";

export const getExplore = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await exploreService.getExploreVideos();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
