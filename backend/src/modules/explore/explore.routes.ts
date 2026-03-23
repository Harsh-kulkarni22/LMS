import { Router } from "express";
import { getExplore } from "./explore.controller";

const router = Router();

router.get("/", getExplore);

export default router;
