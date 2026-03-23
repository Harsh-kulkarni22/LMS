"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.security = void 0;
exports.security = {
    PASSWORD_SALT_ROUNDS: 10,
    ACCESS_TOKEN_EXPIRES_IN: "15m",
    REFRESH_TOKEN_EXPIRES_IN: "30d",
    REFRESH_TOKEN_COOKIE_NAME: "refresh_token",
    // Refresh token expiry in ms (30 days)
    REFRESH_TOKEN_MAX_AGE_MS: 30 * 24 * 60 * 60 * 1000,
};
