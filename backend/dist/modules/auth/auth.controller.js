"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const security_1 = require("../../config/security");
const env_1 = require("../../config/env");
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const user = await authService.registerUser(email, password, name);
        res.status(201).json({ success: true, user });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
        res.cookie(security_1.security.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: security_1.security.REFRESH_TOKEN_MAX_AGE_MS,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain: env_1.env.COOKIE_DOMAIN,
        });
        res.status(200).json({ success: true, user, accessToken });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies[security_1.security.REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) {
            res.status(401).json({ success: false, message: "No refresh token provided" });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(refreshToken);
        res.cookie(security_1.security.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: security_1.security.REFRESH_TOKEN_MAX_AGE_MS,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain: env_1.env.COOKIE_DOMAIN,
        });
        res.status(200).json({ success: true, accessToken });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const refreshToken = req.cookies[security_1.security.REFRESH_TOKEN_COOKIE_NAME];
        if (userId && refreshToken) {
            await authService.logoutUser(userId, refreshToken);
        }
        res.clearCookie(security_1.security.REFRESH_TOKEN_COOKIE_NAME);
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
