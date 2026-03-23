"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHealth = void 0;
const checkHealth = (req, res) => {
    res.status(200).json({ status: "ok" });
};
exports.checkHealth = checkHealth;
