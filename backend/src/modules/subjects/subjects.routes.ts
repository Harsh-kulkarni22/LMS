import { Router } from "express";
import { getSubjects, getSubject, getTree } from "./subjects.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", getSubjects);
router.get("/:id", getSubject);
router.get("/:id/tree", requireAuth, getTree);

export default router;
