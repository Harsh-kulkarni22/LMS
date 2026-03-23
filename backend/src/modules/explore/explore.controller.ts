import { Request, Response, NextFunction } from "express";
import * as exploreService from "./explore.service";

export const getExplore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string | undefined;
    const data = await exploreService.getExploreVideos(query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
