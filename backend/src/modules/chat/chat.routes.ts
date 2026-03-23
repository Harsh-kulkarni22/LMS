import { Router } from "express";
import { postMessage } from "./chat.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, postMessage);

export default router;
