import { Router } from "express";
import { getVideoProgress, updateVideoProgress, getSubjectProgress } from "./progress.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/videos/:videoId", requireAuth, getVideoProgress);
router.post("/videos/:videoId", requireAuth, updateVideoProgress);
router.get("/subjects/:subjectId", requireAuth, getSubjectProgress);

export default router;
