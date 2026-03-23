import { Router } from "express";
import { getVideo } from "./videos.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/:id", requireAuth, getVideo);

export default router;
