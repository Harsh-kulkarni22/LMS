"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videos_controller_1 = require("./videos.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/:id", auth_middleware_1.requireAuth, videos_controller_1.getVideo);
exports.default = router;
