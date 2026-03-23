"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshUserToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const AppError_1 = require("../../utils/AppError");
const jwt_1 = require("../../utils/jwt");
const security_1 = require("../../config/security");
const registerUser = async (email, password, name) => {
    const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError_1.AppError("Email already in use", 400);
    }
    const password_hash = await bcryptjs_1.default.hash(password, security_1.security.PASSWORD_SALT_ROUNDS);
    const user = await db_1.prisma.user.create({
        data: { email, password_hash, name },
    });
    return { id: user.id, email: user.email, name: user.name };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new AppError_1.AppError("Invalid credentials", 401);
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isPasswordValid)
        throw new AppError_1.AppError("Invalid credentials", 401);
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    const token_hash = await bcryptjs_1.default.hash(refreshToken, security_1.security.PASSWORD_SALT_ROUNDS);
    const expires_at = new Date(Date.now() + security_1.security.REFRESH_TOKEN_MAX_AGE_MS);
    await db_1.prisma.refreshToken.create({
        data: { user_id: user.id, token_hash, expires_at },
    });
    return { user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken };
};
exports.loginUser = loginUser;
const refreshUserToken = async (refreshToken) => {
    let decoded;
    try {
        decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    }
    catch (error) {
        throw new AppError_1.AppError("Invalid refresh token", 401);
    }
    const userId = decoded.userId;
    const dbTokens = await db_1.prisma.refreshToken.findMany({
        where: {
            user_id: userId,
            revoked_at: null,
            expires_at: { gt: new Date() }
        }
    });
    if (dbTokens.length === 0) {
        throw new AppError_1.AppError("Invalid refresh token", 401);
    }
    let matchingToken = null;
    for (const dbToken of dbTokens) {
        const isMatch = await bcryptjs_1.default.compare(refreshToken, dbToken.token_hash);
        if (isMatch) {
            matchingToken = dbToken;
            break;
        }
    }
    if (!matchingToken) {
        throw new AppError_1.AppError("Invalid refresh token", 401);
    }
    await db_1.prisma.refreshToken.update({
        where: { id: matchingToken.id },
        data: { revoked_at: new Date() }
    });
    const accessToken = (0, jwt_1.generateAccessToken)(userId);
    const newRefreshToken = (0, jwt_1.generateRefreshToken)(userId);
    const newTokenHash = await bcryptjs_1.default.hash(newRefreshToken, security_1.security.PASSWORD_SALT_ROUNDS);
    const expires_at = new Date(Date.now() + security_1.security.REFRESH_TOKEN_MAX_AGE_MS);
    await db_1.prisma.refreshToken.create({
        data: { user_id: userId, token_hash: newTokenHash, expires_at }
    });
    return { accessToken, refreshToken: newRefreshToken };
};
exports.refreshUserToken = refreshUserToken;
const logoutUser = async (userId, refreshToken) => {
    const dbTokens = await db_1.prisma.refreshToken.findMany({
        where: { user_id: userId, revoked_at: null }
    });
    for (const dbToken of dbTokens) {
        const isMatch = await bcryptjs_1.default.compare(refreshToken, dbToken.token_hash);
        if (isMatch) {
            await db_1.prisma.refreshToken.update({
                where: { id: dbToken.id },
                data: { revoked_at: new Date() }
            });
            break;
        }
    }
};
exports.logoutUser = logoutUser;
